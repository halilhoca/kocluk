import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getStudentByEmail, updateStudentPassword } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const StudentSignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('Student login attempt:', { email, passwordLength: password.length });

    try {
      // Öğrenci veritabanından kontrol et
      const { data: student, error: studentError } = await getStudentByEmail(email);
      console.log('getStudentByEmail result:', { student, studentError });

      if (studentError || !student) {
        console.log('Student not found or error:', studentError);
        setError('E-posta adresi bulunamadı.');
        return;
      }

      // Şifre kontrolü - detaylı log
      console.log('Password comparison:', {
        enteredPassword: password,
        storedPassword: student.password,
        passwordsMatch: student.password === password,
        storedPasswordLength: student.password?.length,
        enteredPasswordLength: password.length
      });
      
      if (student.password !== password) {
        console.log('Password mismatch!');
        setError('Şifre hatalı.');
        return;
      }

      // İlk giriş kontrolü (password_changed false ise ilk giriş)
      if (!student.password_changed) {
        console.log('First login detected, showing password change');
        setCurrentStudent(student);
        setShowPasswordChange(true);
        return;
      }

      // Başarılı giriş
      console.log('Login successful');
      setUser({ id: student.id, email: student.email, name: student.name });
      navigate('/student/welcome');
      toast.success('Giriş başarılı!');
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş sırasında bir hata oluştu.');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log('handlePasswordChange started with:', { 
      currentStudent: currentStudent?.id, 
      newPassword: newPassword.length + ' characters' 
    });

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır!');
      return;
    }

    try {
      // Şifreyi güncelle
      console.log('Calling updateStudentPassword...');
      const { data, error } = await updateStudentPassword(currentStudent.id, newPassword);
      console.log('updateStudentPassword response:', { data, error });

      if (error) {
        console.error('Password update error:', error);
        setError('Şifre güncellenirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
        return;
      }

      // Giriş yap
      setUser({ id: currentStudent.id, email: currentStudent.email, name: currentStudent.name });
      navigate('/student/welcome');
      toast.success('Şifreniz başarıyla güncellendi!');
    } catch (error) {
      console.error('Password change catch error:', error);
      setError('Şifre güncellenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  if (showPasswordChange) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Şifre Değiştir</h2>
          <p className="text-gray-600 text-center mb-6">İlk girişiniz! Güvenliğiniz için lütfen şifrenizi değiştirin.</p>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">Yeni Şifre:</label>
              <input
                type="password"
                id="newPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="En az 6 karakter"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Şifre Tekrar:</label>
              <input
                type="password"
                id="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Şifreyi Güncelle
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Öğrenci Girişi</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">E-posta:</label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Parola:</label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentSignIn;