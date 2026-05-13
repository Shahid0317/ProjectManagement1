// src/services/mockDb.js

const PRE_AUTH_KEY = 'project_management_pre_auth';
const REGISTERED_KEY = 'project_management_registered';
const PROJECTS_KEY = 'project_management_projects';
const SUBMISSIONS_KEY = 'project_management_submissions';

// Initialize the database with a default Superadmin if it's empty
export const initDb = () => {
  if (!localStorage.getItem(PRE_AUTH_KEY)) {
    const defaultSuperAdmin = { id: 'SUP-001', name: 'Super Admin', role: 'superadmin' };
    localStorage.setItem(PRE_AUTH_KEY, JSON.stringify([defaultSuperAdmin]));
  }
  
  if (!localStorage.getItem(REGISTERED_KEY)) {
    const defaultSuperAdminAccount = { id: 'SUP-001', name: 'Super Admin', role: 'superadmin', password: 'admin' };
    localStorage.setItem(REGISTERED_KEY, JSON.stringify([defaultSuperAdminAccount]));
  }

  if (!localStorage.getItem(PROJECTS_KEY)) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify([]));
  }

  if (!localStorage.getItem(SUBMISSIONS_KEY)) {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([]));
  }
};

// Helpers
const getPreAuth = () => JSON.parse(localStorage.getItem(PRE_AUTH_KEY)) || [];
const getRegistered = () => JSON.parse(localStorage.getItem(REGISTERED_KEY)) || [];
export const getProjects = () => JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
export const getSubmissions = () => JSON.parse(localStorage.getItem(SUBMISSIONS_KEY)) || [];

const savePreAuth = (data) => localStorage.setItem(PRE_AUTH_KEY, JSON.stringify(data));
const saveRegistered = (data) => localStorage.setItem(REGISTERED_KEY, JSON.stringify(data));
const saveProjects = (data) => localStorage.setItem(PROJECTS_KEY, JSON.stringify(data));
const saveSubmissions = (data) => localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(data));

// Pre-authorization (HR/Admin adding users before they register)
export const addPreAuthorizedUser = (id, name, role) => {
  const users = getPreAuth();
  if (users.find(u => u.id === id)) {
    return { success: false, message: 'User ID already exists in system.' };
  }
  users.push({ id, name, role });
  savePreAuth(users);
  return { success: true, message: 'User pre-authorized successfully.' };
};

export const removePreAuthorizedUser = (id) => {
  let users = getPreAuth();
  users = users.filter(u => u.id !== id);
  savePreAuth(users);
  
  // Also remove from registered if they were registered
  let registered = getRegistered();
  registered = registered.filter(u => u.id !== id);
  saveRegistered(registered);
};

export const getPreAuthorizedUsersByRole = (role) => {
  return getPreAuth().filter(u => u.role === role);
};

// Registration & Login
export const registerUser = (name, id, password) => {
  const preAuth = getPreAuth();
  const validUser = preAuth.find(u => u.id === id && u.name.toLowerCase() === name.toLowerCase());

  if (!validUser) {
    return { 
      success: false, 
      message: "Data isn't available. Please contact HR or your Admin." 
    };
  }

  const registered = getRegistered();
  if (registered.find(u => u.id === id)) {
    return { success: false, message: 'User is already registered. Please log in.' };
  }

  registered.push({ ...validUser, password });
  saveRegistered(registered);
  return { success: true, message: 'Registered successfully!' };
};

export const loginUser = (id, password) => {
  const registered = getRegistered();
  const user = registered.find(u => u.id === id && u.password === password);
  
  if (user) {
    // Return user info excluding password
    const { password, ...userInfo } = user;
    // Save current logged in user (mocking session)
    localStorage.setItem('current_user', JSON.stringify(userInfo));
    return { success: true, user: userInfo };
  }
  return { success: false, message: 'Invalid ID or Password.' };
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('current_user');
};

// Project Management
export const assignProject = (adminId, employeeId, projectName, startDate, deadline, budget) => {
  const projects = getProjects();
  
  // Validate if employee exists
  const employee = getPreAuth().find(u => u.id === employeeId && u.role === 'employee');
  if (!employee) {
    return { success: false, message: 'Invalid Employee ID.' };
  }

  const newProject = {
    id: Date.now().toString(),
    adminId,
    employeeId,
    employeeName: employee.name,
    projectName,
    startDate,
    deadline,
    budget: budget || '0',
    status: 'In Progress',
    paymentStatus: 'Pending'
  };

  projects.push(newProject);
  saveProjects(projects);
  return { success: true, message: 'Project assigned successfully!' };
};

export const getProjectsByEmployee = (employeeId) => {
  return getProjects().filter(p => p.employeeId === employeeId);
};

export const getProjectsByAdmin = (adminId) => {
  return getProjects().filter(p => p.adminId === adminId);
};

export const updateProjectStatus = (projectId, status) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projects[index].status = status;
    saveProjects(projects);
    return true;
  }
  return false;
};

export const requestDelayReason = (projectId) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projects[index].delayReasonRequested = true;
    saveProjects(projects);
    return true;
  }
  return false;
};

export const submitDelayReason = (projectId, reason) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projects[index].delayReason = reason;
    saveProjects(projects);
    return true;
  }
  return false;
};

export const getLeaderboard = () => {
  const projects = getProjects();
  const employees = getPreAuthorizedUsersByRole('employee');
  
  const leaderboardMap = {};
  
  // Initialize all employees with 0
  employees.forEach(emp => {
    leaderboardMap[emp.id] = {
      id: emp.id,
      name: emp.name,
      completed: 0
    };
  });

  // Count completed projects
  projects.forEach(p => {
    if (p.status === 'Completed' && leaderboardMap[p.employeeId]) {
      leaderboardMap[p.employeeId].completed += 1;
    }
  });

  // Convert to array and sort descending
  return Object.values(leaderboardMap).sort((a, b) => b.completed - a.completed);
};

export const updateProjectPayment = (projectId, paymentStatus) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === projectId);
  if (index !== -1) {
    projects[index].paymentStatus = paymentStatus;
    saveProjects(projects);
    return true;
  }
  return false;
};

export const getProjectStatusDynamic = (project) => {
  if (project.status === 'Completed' && project.paymentStatus === 'Received') return 'Closed';
  if (project.status === 'Completed') return 'Completed';
  
  const deadlineDate = new Date(project.deadline);
  const today = new Date();
  
  // Strip time for accurate day comparison
  deadlineDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (today > deadlineDate) {
    return 'Delayed';
  }
  return project.status; // Usually 'In Progress'
};

export const submitWork = (employeeId, employeeName, projectId, projectName, description, fileName) => {
  const submissions = getSubmissions();
  submissions.push({
    id: Date.now().toString(),
    employeeId,
    employeeName,
    projectId,
    projectName,
    description,
    fileName,
    date: new Date().toLocaleDateString()
  });
  saveSubmissions(submissions);
  return { success: true, message: 'Work submitted successfully.' };
};
