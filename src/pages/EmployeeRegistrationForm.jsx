import React, { useState } from 'react';
import { UserPlus, Mail, User, CheckCircle, ArrowRight, Phone, Briefcase, FileText, Globe, MapPin, Users } from 'lucide-react';
import { submitRegistrationRequest } from '../services/mockDb';
import { useNavigate } from 'react-router-dom';

const EmployeeRegistrationForm = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [domain, setDomain] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const result = await submitRegistrationRequest(email, name, phone, jobRole, domain, gender, address, bio);
      if (result.success) {
        setStatus({ type: 'success', message: result.message });
        setEmail('');
        setName('');
        setPhone('');
        setJobRole('');
        setDomain('');
        setGender('');
        setAddress('');
        setBio('');
      } else {
        setStatus({ type: 'error', message: result.message });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-mesh flex items-center justify-center p-6 font-body overflow-y-auto">
      <div className="max-w-2xl w-full animate-fadeIn my-10">
        <div className="glass-card p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent opacity-50"></div>
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand-primary/10 border border-brand-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-primary/10">
              <UserPlus className="text-brand-primary" size={28} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tighter">
              Employee <span className="text-brand-primary">Onboarding</span>
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3">Comprehensive Profile Setup</p>
          </div>

          {status.type === 'success' ? (
            <div className="text-center space-y-8 animate-zoomIn py-10">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle className="text-emerald-400" size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white">Application Received</h2>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                  Your profile has been successfully sent for verification. We will notify you once access is granted.
                </p>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="btn-primary w-full flex items-center justify-center gap-3"
              >
                Return to Login <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors">
                    <User size={16} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="FULL NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="input-luxury !pl-14 text-xs"
                  />
                </div>

                {/* Email Address */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors">
                    <Mail size={16} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="EMAIL ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-luxury !pl-14 text-xs"
                  />
                </div>

                {/* Phone Number */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors">
                    <Phone size={16} />
                  </div>
                  <input 
                    type="tel" 
                    placeholder="PHONE NUMBER"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="input-luxury !pl-14 text-xs"
                  />
                </div>

                {/* Job Role */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors">
                    <Briefcase size={16} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="JOB ROLE"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    required
                    className="input-luxury !pl-14 text-xs"
                  />
                </div>

                {/* Domain */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors">
                    <Globe size={16} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="DOMAIN (e.g. Design, Dev)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                    className="input-luxury !pl-14 text-xs"
                  />
                </div>

                {/* Gender */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors z-10">
                    <Users size={16} />
                  </div>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="input-luxury !pl-14 text-xs appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-900">SELECT GENDER</option>
                    <option value="Male" className="bg-slate-900">MALE</option>
                    <option value="Female" className="bg-slate-900">FEMALE</option>
                    <option value="Other" className="bg-slate-900">OTHER</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors">
                  <MapPin size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="RESIDENTIAL ADDRESS"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="input-luxury !pl-14 text-xs"
                />
              </div>

              {/* Bio */}
              <div className="relative group">
                <div className="absolute left-5 top-5 text-slate-500 group-focus-within:text-brand-primary transition-colors">
                  <FileText size={16} />
                </div>
                <textarea 
                  placeholder="ADDITIONAL EXPERIENCE / COMMENTS..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="3"
                  className="input-luxury !pl-14 pt-4 text-xs min-h-[100px] resize-none"
                ></textarea>
              </div>

              {status.type === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-fadeIn text-center">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">{status.message}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`btn-primary w-full flex items-center justify-center gap-3 py-4 text-xs ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'SUBMITTING...' : 'COMPLETE REGISTRATION'}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-brand-primary transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistrationForm;
