import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { getStudentExams, getExamStatistics, deleteStudentExam, StudentExam } from '../../lib/examService';
import { ArrowLeft, Calendar, TrendingUp, Target, Award, Trash2, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StudentExams: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'ALL' | 'TYT' | 'AYT' | 'LGS'>('ALL');

  useEffect(() => {
    if (user?.id) {
      fetchExams();
    }
  }, [user?.id, selectedType]);

  const fetchExams = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const examType = selectedType === 'ALL' ? undefined : selectedType;
      const { data, stats, error } = await getExamStatistics(user.id, examType as any);
      
      if (error) {
        toast.error('Denemeler yüklenirken hata oluştu');
      } else {
        setExams(data || []);
        setStatistics(stats);
      }
    } catch (error) {
      toast.error('Beklenmeyen bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Bu denemeyi silmek istediğinizden emin misiniz?')) return;
    
    const { error } = await deleteStudentExam(examId);
    if (error) {
      toast.error('Deneme silinirken hata oluştu');
    } else {
      toast.success('Deneme başarıyla silindi');
      fetchExams();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'TYT': return 'bg-blue-100 text-blue-800';
      case 'AYT': return 'bg-green-100 text-green-800';
      case 'LGS': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTYTDetails = (exam: StudentExam) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-sm text-gray-600">Türkçe</div>
        <div className="font-semibold">{exam.subject_scores.turkce.correct}D - {exam.subject_scores.turkce.wrong}Y</div>
        <div className="text-blue-600 font-bold">{(exam.subject_scores.turkce.correct - exam.subject_scores.turkce.wrong / 4).toFixed(1)} Net</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Matematik</div>
        <div className="font-semibold">{exam.subject_scores.matematik.correct}D - {exam.subject_scores.matematik.wrong}Y</div>
        <div className="text-blue-600 font-bold">{(exam.subject_scores.matematik.correct - exam.subject_scores.matematik.wrong / 4).toFixed(1)} Net</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Fen Bilimleri</div>
        <div className="font-semibold">{exam.subject_scores.fen.correct}D - {exam.subject_scores.fen.wrong}Y</div>
        <div className="text-blue-600 font-bold">{(exam.subject_scores.fen.correct - exam.subject_scores.fen.wrong / 4).toFixed(1)} Net</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-600">Sosyal Bilimler</div>
        <div className="font-semibold">{exam.subject_scores.sosyal.correct}D - {exam.subject_scores.sosyal.wrong}Y</div>
        <div className="text-blue-600 font-bold">{(exam.subject_scores.sosyal.correct - exam.subject_scores.sosyal.wrong / 4).toFixed(1)} Net</div>
      </div>
    </div>
  );

  const renderSingleSubjectDetails = (exam: StudentExam) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm text-gray-600">Ders</div>
          <div className="font-semibold">{exam.subject_scores.subject}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Doğru - Yanlış - Boş</div>
          <div className="font-semibold">{exam.correct_answers}D - {exam.wrong_answers}Y - {exam.empty_answers}B</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Net</div>
          <div className="text-blue-600 font-bold text-lg">{exam.net_score.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Denemeler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/student/welcome')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Ana Sayfaya Dön
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Denemelerim</h1>
          <div></div>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Toplam Deneme</p>
                  <p className="text-2xl font-bold text-gray-800">{statistics.totalExams}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Ortalama Net</p>
                  <p className="text-2xl font-bold text-gray-800">{statistics.averageNet}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">En İyi Net</p>
                  <p className="text-2xl font-bold text-gray-800">{statistics.bestNet}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Son Gelişim</p>
                  <p className={`text-2xl font-bold ${
                    parseFloat(statistics.improvement) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {parseFloat(statistics.improvement) >= 0 ? '+' : ''}{statistics.improvement}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['ALL', 'TYT', 'AYT', 'LGS'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {type === 'ALL' ? 'Tümü' : type}
            </button>
          ))}
        </div>

        {/* Exams List */}
        <div className="space-y-4">
          {exams.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Henüz deneme bulunmuyor</h3>
              <p className="text-gray-500">İlk denemenizi eklemek için ana sayfaya dönün.</p>
            </div>
          ) : (
            exams.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getExamTypeColor(exam.exam_type)}`}>
                        {exam.exam_type}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800">{exam.exam_name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(exam.exam_date)}
                      </div>
                      <div className="font-semibold text-blue-600">
                        Toplam Net: {exam.net_score.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {exam.exam_type === 'TYT' ? renderTYTDetails(exam) : renderSingleSubjectDetails(exam)}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentExams;