import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import StudentLayout from './components/layout/StudentLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentSignIn from './pages/auth/StudentSignIn';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import StudentList from './pages/students/StudentList';
import StudentDetail from './pages/students/StudentDetail';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentWelcome from './pages/student/StudentWelcome';
import StudentExams from './pages/student/StudentExams';
import PublicReport from './pages/student/PublicReport';
import BookList from './pages/books/BookList';
import ProgramList from './pages/programs/ProgramList';
import CreateProgram from './pages/programs/CreateProgram';
import ProgramDetail from './pages/programs/ProgramDetail';
import StudentView from './pages/student/StudentView';
import ProgramView from './pages/student/ProgramView';

function App() {
  const { user, initialized, initialize } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/student-signin" element={user ? <Navigate to="/student/welcome" /> : <StudentSignIn />} />
        <Route path="/student/:studentId" element={<StudentView />} />
        <Route path="/program/:programId" element={<ProgramView />} />
        <Route path="/public-report/:studentId" element={<PublicReport />} />

        {/* Home page for unauthenticated users */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
        
        {/* Protected routes under Layout (Coach/Teacher) */}
        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/students/:studentId" element={<StudentDetail />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/programs" element={<ProgramList />} />
          <Route path="/programs/new" element={<CreateProgram />} />
          <Route path="/programs/:programId" element={<ProgramDetail />} />
        </Route>
        
        {/* Protected routes under StudentLayout (Student) */}
        <Route element={user ? <StudentLayout /> : <Navigate to="/student-signin" />}>
          <Route path="/student/welcome" element={<StudentWelcome />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/exams" element={<StudentExams />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;