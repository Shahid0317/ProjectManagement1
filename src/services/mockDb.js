import { auth, db } from './firebase';
import { collection, getDocs, setDoc, doc, deleteDoc, updateDoc, query, where, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const initDb = async () => {
  // Not strictly needed for Firestore, but we can keep it for backwards compatibility if called.
};

// --- PRE-AUTHORIZATION ---
export const addPreAuthorizedUser = async (email, name, role, phone = '', jobRole = '', domain = '') => {
  try {
    const preAuthRef = collection(db, 'preAuth');
    const q = query(preAuthRef, where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { success: false, message: 'User Email already pre-authorized.' };
    }
    // Use email as doc ID for easy lookup
    await setDoc(doc(db, 'preAuth', email.toLowerCase()), { 
      email: email.toLowerCase(), 
      name, 
      role,
      phone,
      jobRole,
      domain,
      adminEmail: getCurrentUser()?.email || '' // Track who authorized this user
    });
    return { success: true, message: 'User pre-authorized successfully.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const removePreAuthorizedUser = async (email) => {
  try {
    await deleteDoc(doc(db, 'preAuth', email.toLowerCase()));
  } catch (error) {
    console.error("Error removing pre-auth", error);
  }
};

export const getPreAuthorizedUsersByRole = async (role) => {
  try {
    const q = query(collection(db, 'preAuth'), where('role', '==', role));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
};

// --- AUTHENTICATION ---
export const registerUser = async (name, email, password) => {
  try {
    // 1. Check if email is in preAuth
    const preAuthDocRef = doc(db, 'preAuth', email.toLowerCase());
    const q = query(collection(db, 'preAuth'), where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    
    // Check if it's the bootstrap superadmin
    let isBootstrapSuperadmin = email.toLowerCase() === 'superadmin@123.com';
    let role = 'employee';
    let authName = name;

    if (!isBootstrapSuperadmin) {
      if (snapshot.empty) {
        return { success: false, message: "Email not pre-authorized. Please contact your Admin." };
      }
      const preAuthData = snapshot.docs[0].data();
      role = preAuthData.role;
      authName = preAuthData.name; // enforce the pre-authorized name
    } else {
      role = 'superadmin';
    }

    // 2. Create Firebase Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 3. Save to Users collection
    const userData = {
      uid: user.uid,
      email: email.toLowerCase(),
      name: authName,
      role: role
    };
    await setDoc(doc(db, 'users', user.uid), userData);

    return { success: true, message: 'Registered successfully! You can now log in.' };
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      return { success: false, message: 'Email is already registered. Please log in.' };
    }
    return { success: false, message: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user role from Firestore
    const userDocRef = collection(db, 'users');
    const q = query(userDocRef, where('uid', '==', user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Edge case: Auth exists but user doc doesn't.
      if (email.toLowerCase() === 'superadmin@123.com') {
        const userData = { uid: user.uid, email: email.toLowerCase(), name: 'Super Admin', role: 'superadmin' };
        await setDoc(doc(db, 'users', user.uid), userData);
        localStorage.setItem('current_user', JSON.stringify({ id: email, email, name: 'Super Admin', role: 'superadmin', uid: user.uid }));
        return { success: true, user: userData };
      }
      return { success: false, message: 'User record not found in database.' };
    }

    const userData = snapshot.docs[0].data();
    // Maintain localStorage session for simple sync retrieval
    const sessionData = {
      id: userData.email, // using email as id for legacy support in components
      email: userData.email,
      name: userData.name,
      role: userData.role,
      uid: userData.uid
    };
    localStorage.setItem('current_user', JSON.stringify(sessionData));
    
    return { success: true, user: sessionData };
  } catch (error) {
    return { success: false, message: 'Invalid Email or Password.' };
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('current_user');
  } catch(e) {
    console.error(e);
  }
};

// --- PROJECT MANAGEMENT ---
export const assignProject = async (adminId, employeeEmails, projectName, description, startDate, deadline, budget) => {
  try {
    const emails = (Array.isArray(employeeEmails) ? employeeEmails : [employeeEmails])
      .filter(e => e && typeof e === 'string')
      .map(e => e.toLowerCase().trim());
    
    // Validate all employees exist & Check Workload Limit
    const employeeNames = [];
    for (const email of emails) {
      // Check Workload
      const activeProjects = await getProjectsByEmployee(email);
      const pendingCount = activeProjects.filter(p => p.status !== 'Completed').length;
      if (pendingCount >= 5) {
        return { 
          success: false, 
          message: `Mission Aborted: ${email} has reached the maximum capacity of 5 active projects.` 
        };
      }

      const preAuthRef = doc(db, 'preAuth', email);
      const preAuthSnap = await getDoc(preAuthRef);
      
      if (!preAuthSnap.exists()) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email), where('role', '==', 'employee'));
        const userSnap = await getDocs(q);
        
        if (userSnap.empty) {
          return { success: false, message: `Employee ${email} is not authorized.` };
        }
        employeeNames.push(userSnap.docs[0].data().name);
      } else {
        employeeNames.push(preAuthSnap.data().name);
      }
    }

    const newProject = {
      id: Date.now().toString(),
      adminId,
      adminEmail: getCurrentUser()?.email || adminId,
      employeeId: emails, // Stored as array for group support
      employeeName: employeeNames.join(', '), // Comma separated for display
      projectName,
      description,
      startDate,
      deadline,
      budget: budget || '0',
      status: 'In Progress',
      paymentStatus: 'Pending',
      delayReasonRequested: false,
      delayReason: ''
    };

    await setDoc(doc(db, 'projects', newProject.id), newProject);
    return { success: true, message: 'Project assigned successfully!' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getProjects = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'projects'));
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    return [];
  }
};

export const getProjectsByEmployee = async (employeeId) => {
  try {
    // We query both legacy (string) and new (array) employeeId formats to ensure all projects show up
    const q1 = query(collection(db, 'projects'), where('employeeId', '==', employeeId));
    const q2 = query(collection(db, 'projects'), where('employeeId', 'array-contains', employeeId));
    
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
    
    const results = new Map();
    snap1.docs.forEach(doc => results.set(doc.id, doc.data()));
    snap2.docs.forEach(doc => results.set(doc.id, doc.data()));
    
    return Array.from(results.values());
  } catch (error) {
    console.error("Error fetching employee projects:", error);
    return [];
  }
};

export const deleteProject = async (projectId) => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
};

export const getProjectsByAdmin = async (adminId) => {
  try {
    const q = query(collection(db, 'projects'), where('adminId', '==', adminId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    return [];
  }
};

export const updateProjectStatus = async (projectId, status) => {
  try {
    await updateDoc(doc(db, 'projects', projectId), { status });
    return true;
  } catch (error) {
    return false;
  }
};

export const requestDelayReason = async (projectId) => {
  try {
    await updateDoc(doc(db, 'projects', projectId), { delayReasonRequested: true });
    return true;
  } catch (error) {
    return false;
  }
};

export const submitDelayReason = async (projectId, reason) => {
  try {
    await updateDoc(doc(db, 'projects', projectId), { delayReason: reason });
    return true;
  } catch (error) {
    return false;
  }
};

export const updateProjectPayment = async (projectId, paymentStatus) => {
  try {
    await updateDoc(doc(db, 'projects', projectId), { paymentStatus });
    return true;
  } catch (error) {
    return false;
  }
};

export const saveFinalSubmission = async (projectId, { description, finalImages, finalZipUrl }) => {
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      finalSubmission: {
        description,
        finalImages: finalImages || [],
        finalZipUrl: finalZipUrl || null,
        completedAt: new Date().toLocaleDateString()
      }
    });
    return true;
  } catch (error) {
    console.error('saveFinalSubmission error:', error);
    return false;
  }
};

// Keeping this synchronous as it just calculates on the frontend
export const getProjectStatusDynamic = (project) => {
  if (project.status === 'Completed' && project.paymentStatus === 'Received') return 'Closed';
  if (project.status === 'Completed') return 'Completed';
  
  const deadlineDate = new Date(project.deadline);
  const today = new Date();
  
  deadlineDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (today > deadlineDate) {
    return 'Delayed';
  }
  return project.status;
};

export const getDailyTracking = async (year, month, day) => {
  try {
    const trackingRef = collection(db, 'yearly_tracking', year.toString(), 'months', month, 'days', day.toString(), 'employees');
    const snapshot = await getDocs(trackingRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching daily tracking:", error);
    return [];
  }
};

// --- SUBMISSIONS ---
export const submitWork = async (employeeId, employeeName, projectId, projectName, description, files) => {
  try {
    const submissionId = Date.now().toString();
    const projectDoc = await getDocs(query(collection(db, 'projects'), where('id', '==', projectId)));
    const adminEmail = projectDoc.docs[0]?.data()?.adminEmail || '';

    const today = new Date();
    const yearStr = today.getFullYear().toString();
    const monthName = today.toLocaleString('default', { month: 'long' }); // e.g., "May"
    const dayStr = today.getDate().toString(); // e.g., "13"
    const dateStr = today.toLocaleDateString();
    const dateISO = today.toISOString().split('T')[0];

    const submissionData = {
      id: submissionId,
      employeeId,
      employeeName,
      projectId,
      projectName,
      adminEmail,
      description,
      files: files || [], // Array of { name, url }
      date: dateStr,
      timestamp: today.getTime()
    };
    
    // 1. Save to main submissions collection
    await setDoc(doc(db, 'submissions', submissionId), submissionData);

    const trackingDocRef = doc(db, 'yearly_tracking', yearStr, 'months', monthName, 'days', dayStr, 'employees', employeeId);
    
    await setDoc(trackingDocRef, {
      employeeId,
      employeeName,
      year: parseInt(yearStr),
      month: monthName,
      day: parseInt(dayStr),
      date: dateISO,
      lastUpdate: dateStr,
      status: 'Worked',
      projectName,
      workInfo: description,
      filesCount: files.length,
      timestamp: today.getTime()
    }, { merge: true });

    return { success: true, message: 'Work submitted successfully.' };
  } catch (error) {
    console.error("Submit error:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Checks all employees and marks them as "No Work" for today if they haven't submitted yet.
 * This should be called by Admins/Superadmins to ensure the tracking table is populated daily.
 */
export const markAttendance = async () => {
  try {
    const today = new Date();
    const yearStr = today.getFullYear().toString();
    const monthName = today.toLocaleString('default', { month: 'long' });
    const dayStr = today.getDate().toString();
    const dateStr = today.toLocaleDateString();
    const dateISO = today.toISOString().split('T')[0];

    // 1. Get all employees
    const empSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'employee')));
    const allEmployees = empSnapshot.docs.map(doc => doc.data());

    // 2. For each employee, check if they have a record for today
    for (const emp of allEmployees) {
      const docRef = doc(db, 'yearly_tracking', yearStr, 'months', monthName, 'days', dayStr, 'employees', emp.email);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          employeeId: emp.email,
          employeeName: emp.name,
          year: parseInt(yearStr),
          month: monthName,
          day: parseInt(dayStr),
          date: dateISO,
          status: 'No Work',
          lastUpdate: dateStr,
          workInfo: 'No work has been done on this day',
          filesCount: 0,
          timestamp: today.getTime()
        });
      }
    }
  } catch (error) {
    console.error("Attendance check error:", error);
  }
};

export const getSubmissions = async (user) => {
  try {
    let q;
    if (user.role === 'superadmin') {
      // Superadmin sees everything
      q = collection(db, 'submissions');
    } else if (user.role === 'admin') {
      // Admin only sees submissions for projects they assigned
      q = query(collection(db, 'submissions'), where('adminEmail', '==', user.email));
    } else {
      // Employees only see their own submissions
      q = query(collection(db, 'submissions'), where('employeeId', '==', user.email));
    }
    
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => doc.data());
    
    if (user.role === 'admin') {
      console.log(`Admin ${user.email} fetching. Found ${results.length} results.`);
    }

    return results;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};

// --- REGISTRATION REQUESTS ---
export const submitRegistrationRequest = async (email, name, phone, jobRole, domain, gender, address, bio) => {
  try {
    const regRef = collection(db, 'registrationRequests');
    const q = query(regRef, where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return { success: false, message: 'Registration request already submitted for this email.' };
    }
    
    // Also check if already pre-authorized or registered
    const preAuthRef = doc(db, 'preAuth', email.toLowerCase());
    const preAuthSnap = await getDoc(preAuthRef);
    if (preAuthSnap.exists()) {
      return { success: false, message: 'This email is already authorized. Please go to the Signup page.' };
    }

    await setDoc(doc(db, 'registrationRequests', email.toLowerCase()), {
      email: email.toLowerCase(),
      name,
      phone: phone || 'Not Provided',
      jobRole: jobRole || 'Not Specified',
      domain: domain || 'Not Specified',
      gender: gender || 'Not Specified',
      address: address || 'Not Provided',
      bio: bio || 'No additional information provided',
      status: 'pending',
      timestamp: Date.now()
    });
    return { success: true, message: 'Registration request submitted successfully. Please wait for Admin approval.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getPendingRegistrations = async () => {
  try {
    const q = query(collection(db, 'registrationRequests'), where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return [];
  }
};

export const approveRegistrationRequest = async (name, email, adminEmail) => {
  try {
    // 1. Add to preAuth
    const result = await addPreAuthorizedUser(email, name, 'employee');
    if (!result.success) return result;

    // Save who approved this user
    await updateDoc(doc(db, 'preAuth', email.toLowerCase()), {
      approvedBy: adminEmail,
      approvedAt: new Date().toLocaleDateString()
    });

    // 2. Delete the request
    await deleteDoc(doc(db, 'registrationRequests', email.toLowerCase()));
    return { success: true, message: 'Request approved and user pre-authorized.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const declineRegistrationRequest = async (email) => {
  try {
    await deleteDoc(doc(db, 'registrationRequests', email.toLowerCase()));
    return { success: true, message: 'Registration request declined.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getTeamSubmissionStatus = async (projectId, memberEmails) => {
  try {
    const todayStr = new Date().toLocaleDateString();
    const q = query(
      collection(db, 'submissions'), 
      where('projectId', '==', projectId),
      where('date', '==', todayStr)
    );
    const snapshot = await getDocs(q);
    const submissions = snapshot.docs.map(doc => doc.data());
    
    return memberEmails.map(email => {
      const submission = submissions.find(s => s.employeeId === email);
      return {
        email,
        name: submission ? submission.employeeName : email.split('@')[0],
        submitted: !!submission
      };
    });
  } catch (error) {
    console.error("Error fetching team status:", error);
    return [];
  }
};

export const updateProjectPaymentStatus = async (projectId, status) => {
  try {
    await updateDoc(doc(db, 'projects', projectId), { paymentStatus: status });
    return { success: true, message: `Project payment status updated to ${status}.` };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
