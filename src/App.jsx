import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthPage from './pages/AuthPage';
import EmployeePage from './pages/EmployeePage';
import AdminPage from './pages/AdminPage';
import SuperadminPage from './pages/SuperadminPage';
import EmployeeRegistrationForm from './pages/EmployeeRegistrationForm';
import ErrorPage from './components/ErrorPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen selection:bg-indigo-500/30">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/register-employee" element={<EmployeeRegistrationForm />} />
            <Route path="/superadmin" element={<SuperadminPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="*" element={<ErrorPage type="404" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
