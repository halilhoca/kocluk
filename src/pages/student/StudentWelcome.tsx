import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { BookOpen, User, LogOut, Calculator, X } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { saveTYTExam, saveSingleSubjectExam } from '../../lib/examService';
import toast from 'react-hot-toast';

const StudentWelcome: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showExamsModal, setShowExamsModal] = useState(false);
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [selectedExamType, setSelectedExamType] = useState('');
  const [examName, setExamName] = useState('');
  const [examData, setExamData] = useState({
    subject: '',
    correct: '',
    wrong: '',
    blank: ''
  });
  
  const [tytData, setTytData] = useState({
    turkce: { correct: '', wrong: '', blank: '' },
    matematik: { correct: '', wrong: '', blank: '' },
    fen: { correct: '', wrong: '', blank: '' },
    sosyal: { correct: '', wrong: '', blank: '' }
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const goToAssignments = () => {
    navigate('/student/dashboard');
  };

  const openExamsModal = () => {
    setShowExamsModal(true);
  };

  const goToExamsList = () => {
    navigate('/student/exams');
  };

  const closeExamsModal = () => {
    setShowExamsModal(false);
    setShowAddExamModal(false);
    setSelectedExamType('');
    setExamName('');
    setExamData({ subject: '', correct: '', wrong: '', blank: '' });
    setTytData({
      turkce: { correct: '', wrong: '', blank: '' },
      matematik: { correct: '', wrong: '', blank: '' },
      fen: { correct: '', wrong: '', blank: '' },
      sosyal: { correct: '', wrong: '', blank: '' }
    });
  };

  const openAddExamModal = () => {
    setShowAddExamModal(true);
  };

  const handleExamTypeSelect = (type: string) => {
    setSelectedExamType(type);
    setExamName('');
  };

  const handleExamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('Kullanıcı bilgisi bulunamadı');
      return;
    }

    try {
      let result;
      
      if (selectedExamType === 'TYT') {
        // TYT denemesi kaydet
        result = await saveTYTExam(user.id, {
          examName,
          turkce: tytData.turkce,
          matematik: tytData.matematik,
          fen: tytData.fen,
          sosyal: tytData.sosyal
        });
      } else {
        // AYT veya LGS denemesi kaydet
        result = await saveSingleSubjectExam(user.id, selectedExamType as 'AYT' | 'LGS', {
          examName,
          subject: examData.subject,
          correct: examData.correct,
          wrong: examData.wrong,
          blank: examData.blank
        });
      }

      if (result.error) {
        toast.error('Deneme kaydedilirken hata oluştu');
        console.error('Kaydetme hatası:', result.error);
      } else {
        toast.success(`${selectedExamType} denemesi başarıyla kaydedildi!`);
        closeExamsModal();
        // Form verilerini temizle
        setExamName('');
        setExamData({ subject: '', correct: '', wrong: '', blank: '' });
        setTytData({
          turkce: { correct: '', wrong: '' },
          matematik: { correct: '', wrong: '' },
          fen: { correct: '', wrong: '' },
          sosyal: { correct: '', wrong: '' }
        });
      }
    } catch (error) {
      toast.error('Beklenmeyen bir hata oluştu');
      console.error('Deneme kaydetme hatası:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setExamData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleTytInputChange = (subject: string, field: string, value: string) => {
    setTytData(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value
      }
    }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Welcome Message */}
          <div className="mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Hoş Geldin, {user.name || 'Öğrenci'}! 👋
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-gray-600 mb-8"
            >
              Ödevlerini takip etmeye hazır mısın?
            </motion.p>
          </div>

          {/* Main Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={goToAssignments}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-6 px-12 rounded-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-xl"
            >
              <BookOpen className="h-8 w-8 mr-4" />
              Ödevlerim
            </button>
            
            <button
              onClick={openExamsModal}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6 px-12 rounded-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-xl"
            >
              <Calculator className="h-8 w-8 mr-4" />
              Denemelerim
            </button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-green-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tamamlanan Ödevler</h3>
              <p className="text-gray-600">Başarıyla tamamladığın ödevleri görüntüle</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-yellow-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bekleyen Ödevler</h3>
              <p className="text-gray-600">Yapman gereken ödevleri kontrol et</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <div className="text-blue-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">İlerleme Takibi</h3>
              <p className="text-gray-600">Başarı oranını ve gelişimini izle</p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Denemeler Ana Modal */}
      {showExamsModal && !showAddExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Denemelerim</h2>
              <button
                onClick={closeExamsModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={openAddExamModal}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-lg mb-4"
              >
                <Calculator className="h-6 w-6 mr-3" />
                Deneme Ekle
              </button>
              
              <button
                onClick={goToExamsList}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center text-lg mb-6"
              >
                <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Geçmiş Denemeleri Görüntüle
              </button>
              
              <p className="text-gray-500 text-sm">
                Yeni deneme ekle veya geçmiş denemelerini incele.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Deneme Ekleme Modal */}
      {showAddExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Deneme Ekle</h2>
              <button
                onClick={closeExamsModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {!selectedExamType ? (
              <div className="space-y-4">
                <p className="text-gray-600 text-center mb-6">Deneme türünü seçin:</p>
                
                <button
                  onClick={() => handleExamTypeSelect('TYT')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                  TYT
                </button>
                
                <button
                  onClick={() => handleExamTypeSelect('AYT')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                  AYT
                </button>
                
                <button
                  onClick={() => handleExamTypeSelect('LGS')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg"
                >
                  LGS
                </button>
              </div>
            ) : (
              <form onSubmit={handleExamSubmit} className="space-y-6">
                <div className="text-center mb-4">
                  <span className="inline-block bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium">
                    {selectedExamType} Denemesi
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deneme Adı
                  </label>
                  <input
                    type="text"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Örn: 1. Deneme, Mayıs Denemesi"
                    required
                  />
                </div>

                {selectedExamType === 'TYT' ? (
                   <div className="space-y-4">
                     {/* Header */}
                      <div className="grid grid-cols-4 gap-4 text-center font-semibold text-gray-700 border-b pb-2">
                        <div>Ders</div>
                        <div className="text-green-700">Doğru</div>
                        <div className="text-red-700">Yanlış</div>
                        <div className="text-blue-700">Net</div>
                      </div>

                     {/* Türkçe */}
                     <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100">
                       <div className="font-medium text-gray-800">Türkçe</div>
                       <div>
                         <input
                           type="number"
                           min="0"
                           value={tytData.turkce.correct}
                           onChange={(e) => handleTytInputChange('turkce', 'correct', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-center"
                           placeholder="0"
                         />
                       </div>
                       <div>
                         <input
                           type="number"
                           min="0"
                           value={tytData.turkce.wrong}
                           onChange={(e) => handleTytInputChange('turkce', 'wrong', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-center"
                           placeholder="0"
                         />
                       </div>
                       <div>
                          <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-center font-semibold text-blue-700">
                            {(() => {
                              const correct = parseInt(tytData.turkce.correct) || 0;
                              const wrong = parseInt(tytData.turkce.wrong) || 0;
                              const net = correct - (wrong / 4);
                              return net.toFixed(2);
                            })()}
                          </div>
                        </div>
                     </div>

                     {/* Matematik */}
                     <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100">
                       <div className="font-medium text-gray-800">Matematik</div>
                       <div>
                         <input
                           type="number"
                           min="0"
                           value={tytData.matematik.correct}
                           onChange={(e) => handleTytInputChange('matematik', 'correct', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-center"
                           placeholder="0"
                         />
                       </div>
                       <div>
                         <input
                           type="number"
                           min="0"
                           value={tytData.matematik.wrong}
                           onChange={(e) => handleTytInputChange('matematik', 'wrong', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-center"
                           placeholder="0"
                         />
                       </div>
                       <div>
                          <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-center font-semibold text-blue-700">
                            {(() => {
                              const correct = parseInt(tytData.matematik.correct) || 0;
                              const wrong = parseInt(tytData.matematik.wrong) || 0;
                              const net = correct - (wrong / 4);
                              return net.toFixed(2);
                            })()}
                          </div>
                        </div>
                     </div>

                     {/* Fen Bilimleri */}
                     <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100">
                       <div className="font-medium text-gray-800">Fen Bilimleri</div>
                       <div>
                         <input
                           type="number"
                           min="0"
                           value={tytData.fen.correct}
                           onChange={(e) => handleTytInputChange('fen', 'correct', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-center"
                           placeholder="0"
                         />
                       </div>
                       <div>
                         <input
                           type="number"
                           min="0"
                           value={tytData.fen.wrong}
                           onChange={(e) => handleTytInputChange('fen', 'wrong', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-center"
                           placeholder="0"
                         />
                       </div>
                       <div>
                          <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-center font-semibold text-blue-700">
                            {(() => {
                              const correct = parseInt(tytData.fen.correct) || 0;
                              const wrong = parseInt(tytData.fen.wrong) || 0;
                              const net = correct - (wrong / 4);
                              return net.toFixed(2);
                            })()}
                          </div>
                        </div>
                     </div>

                     {/* Sosyal Bilimler */}
                     <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100">
                       <div className="font-medium text-gray-800">Sosyal Bilimler</div>
                       <div>
                         <input
                           type="number"
                           min="0"
                           value={tytData.sosyal.correct}
                           onChange={(e) => handleTytInputChange('sosyal', 'correct', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-center"
                           placeholder="0"
                         />
                       </div>
                       <div>
                         <input
                           type="number"
                           min="0"
                           value={tytData.sosyal.wrong}
                           onChange={(e) => handleTytInputChange('sosyal', 'wrong', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-center"
                           placeholder="0"
                         />
                       </div>
                       <div>
                          <div className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 text-center font-semibold text-blue-700">
                            {(() => {
                              const correct = parseInt(tytData.sosyal.correct) || 0;
                              const wrong = parseInt(tytData.sosyal.wrong) || 0;
                              const net = correct - (wrong / 4);
                              return net.toFixed(2);
                            })()}
                          </div>
                        </div>
                     </div>

                     {/* Toplam Net Satırı */}
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div className="font-bold text-gray-800">TOPLAM</div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center font-bold text-green-800">
                        {(() => {
                          const toplamDogru = (parseInt(tytData.turkce.correct) || 0) + 
                                            (parseInt(tytData.matematik.correct) || 0) + 
                                            (parseInt(tytData.fen.correct) || 0) + 
                                            (parseInt(tytData.sosyal.correct) || 0);
                          return toplamDogru;
                        })()} 
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-center font-bold text-red-800">
                        {(() => {
                          const toplamYanlis = (parseInt(tytData.turkce.wrong) || 0) + 
                                             (parseInt(tytData.matematik.wrong) || 0) + 
                                             (parseInt(tytData.fen.wrong) || 0) + 
                                             (parseInt(tytData.sosyal.wrong) || 0);
                          return toplamYanlis;
                        })()} 
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center font-bold text-blue-800">
                        {(() => {
                          const turkceNet = (parseInt(tytData.turkce.correct) || 0) - ((parseInt(tytData.turkce.wrong) || 0) / 4);
                          const matematikNet = (parseInt(tytData.matematik.correct) || 0) - ((parseInt(tytData.matematik.wrong) || 0) / 4);
                          const fenNet = (parseInt(tytData.fen.correct) || 0) - ((parseInt(tytData.fen.wrong) || 0) / 4);
                          const sosyalNet = (parseInt(tytData.sosyal.correct) || 0) - ((parseInt(tytData.sosyal.wrong) || 0) / 4);
                          const toplamNet = turkceNet + matematikNet + fenNet + sosyalNet;
                          return toplamNet.toFixed(2);
                        })()} 
                      </div>
                    </div>
                   </div>
                 ) : (
                   <div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Ders Adı
                       </label>
                       <input
                         type="text"
                         value={examData.subject}
                         onChange={(e) => handleInputChange('subject', e.target.value)}
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                         placeholder="Matematik, Türkçe, vb."
                         required
                       />
                     </div>

                     <div className="grid grid-cols-3 gap-4 mt-4">
                       <div>
                         <label className="block text-sm font-medium text-green-700 mb-2">
                           Doğru
                         </label>
                         <input
                           type="number"
                           min="0"
                           value={examData.correct}
                           onChange={(e) => handleInputChange('correct', e.target.value)}
                           className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                           placeholder="0"
                           required
                         />
                       </div>

                       <div>
                         <label className="block text-sm font-medium text-red-700 mb-2">
                           Yanlış
                         </label>
                         <input
                           type="number"
                           min="0"
                           value={examData.wrong}
                           onChange={(e) => handleInputChange('wrong', e.target.value)}
                           className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                           placeholder="0"
                           required
                         />
                       </div>

                       <div>
                         <label className="block text-sm font-medium text-gray-700 mb-2">
                           Boş
                         </label>
                         <input
                           type="number"
                           min="0"
                           value={examData.blank}
                           onChange={(e) => handleInputChange('blank', e.target.value)}
                           className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                           placeholder="0"
                           required
                         />
                       </div>
                     </div>
                   </div>
                 )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedExamType('')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Geri
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-colors font-medium"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentWelcome;