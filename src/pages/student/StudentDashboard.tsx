import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface StudentAssignment {
  id: string;
  note?: string;
  is_completed: boolean;
  day: string;
  time?: string;
  page_start?: number;
  page_end?: number;
  correct_answers?: number;
  wrong_answers?: number;
  blank_answers?: number;
  books: { title: string; subject?: string } | null;
  programs: { title: string } | null;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<any>(null);
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showPending, setShowPending] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user) {
        setError('Kullanıcı oturumu bulunamadı.');
        setLoading(false);
        return;
      }

      try {
        // Öğrencinin kendi bilgilerini çek
        const { data: student, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .limit(1)
          .maybeSingle();

        if (studentError) {
          throw studentError;
        }
        
        if (!student) {
          throw new Error('Öğrenci kaydı bulunamadı. Lütfen yöneticinizle iletişime geçin.');
        }
        
        setStudentData(student);

        // Öğrencinin atamalarını çek
        const { data: studentAssignments, error: assignmentsError } = await supabase
          .from('assignments')
          .select(`
            id,
            note,
            is_completed,
            day,
            time,
            page_start,
            page_end,
            correct_answers,
            wrong_answers,
            blank_answers,
            books (title, subject),
            programs (title)
          `)
          .eq('student_id', student.id)
          .order('day', { ascending: true });

        if (assignmentsError) {
          throw assignmentsError;
        }
        setAssignments(studentAssignments || []);

      } catch (err: any) {
        console.error('Öğrenci verileri çekilirken hata oluştu:', err.message);
        setError('Veriler yüklenirken bir hata oluştu: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user]);

  const handleCompleteAssignment = async (assignmentId: string, currentStatus: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('assignments')
        .update({ is_completed: !currentStatus })
        .eq('id', assignmentId);

      if (updateError) {
        throw updateError;
      }

      setAssignments(prevAssignments =>
        prevAssignments.map(assignment =>
          assignment.id === assignmentId ? { ...assignment, is_completed: !currentStatus } : assignment
        )
      );
    } catch (err: any) {
      console.error('Ödev durumu güncellenirken hata oluştu:', err.message);
      setError('Ödev durumu güncellenirken bir hata oluştu: ' + err.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 text-lg">Hata: {error}</div>;
  }

  if (!studentData) {
    return <div className="flex justify-center items-center h-screen text-lg">Öğrenci verisi bulunamadı.</div>;
  }

  // İstatistikleri hesapla
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(a => a.is_completed).length;
  const pendingAssignments = totalAssignments - completedAssignments;
  const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Hoş Geldin, {studentData.name}!</h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-blue-100">Toplam Ödev</p>
              <motion.p 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-xl font-bold text-white"
              >
                {totalAssignments}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="bg-gradient-to-br from-green-500 to-emerald-600 border-0 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-green-100">Tamamlanan</p>
              <motion.p 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="text-xl font-bold text-white"
              >
                {completedAssignments}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-amber-100">Bekleyen</p>
              <motion.p 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="text-xl font-bold text-white"
              >
                {pendingAssignments}
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.05, y: -2 }}
          className="bg-gradient-to-br from-purple-500 to-pink-600 border-0 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-purple-100">Tamamlanma</p>
              <motion.p 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="text-xl font-bold text-white"
              >
                %{completionRate}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white shadow-md rounded-lg p-6 mb-6"
      >
        {totalAssignments > 0 && (
          <div className="text-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-lg font-medium text-gray-700 mb-4"
            >
              İlerleme Durumu
            </motion.p>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full shadow-sm"
              ></motion.div>
            </div>
            <motion.p 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-sm text-gray-600 font-medium"
            >
              {completedAssignments}/{totalAssignments} ödev tamamlandı (%{completionRate})
            </motion.p>
            
            {/* Atanan Ödev Başlıkları */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="mt-4"
            >
              {assignments.length > 0 ? (
                <div className="space-y-2">
                  {[...new Set(assignments.map(a => a.books?.title || a.programs?.title).filter(Boolean))]
                    .slice(0, 3)
                    .map((title, index) => (
                      <div
                        key={index}
                        className="font-medium text-white bg-indigo-600 cursor-pointer hover:bg-indigo-700 transition-colors duration-200 text-center py-2 px-4 rounded-lg shadow-md hover:shadow-lg"
                        onClick={() => {
                          if (user?.id) {
                            navigate(`/student/${user.id}`);
                          }
                        }}
                      >
                        {title}
                      </div>
                    ))}
                  {[...new Set(assignments.map(a => a.books?.title || a.programs?.title).filter(Boolean))].length > 3 && (
                    <div className="text-sm text-gray-500 text-center py-1">
                      +{[...new Set(assignments.map(a => a.books?.title || a.programs?.title).filter(Boolean))].length - 3} daha fazla
                    </div>
                  )}
                </div>
              ) : (
                <div className="font-medium text-gray-500 text-center py-2">
                  Henüz ödev atanmamış
                </div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>


    </div>
  );
};

export default StudentDashboard;