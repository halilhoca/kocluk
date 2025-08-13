import React, { useState } from 'react';
import { ChevronRight, CheckCircle, Circle, BookOpen, TrendingUp, Target, Award, BarChart3, Star, Zap, Trophy, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface Topic {
  id: string;
  name: string;
  completed: boolean;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  icon: string;
  progress: number;
  topics: Topic[];
}

const SubjectAnalysis: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [subjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Matematik',
      color: 'bg-blue-500',
      icon: '📐',
      progress: 75,
      topics: [
        { id: '1', name: 'Doğal Sayılar', completed: true },
        { id: '2', name: 'Tam Sayılar', completed: true },
        { id: '3', name: 'Rasyonel Sayılar', completed: true },
        { id: '4', name: 'Cebirsel İfadeler', completed: false },
        { id: '5', name: 'Denklemler', completed: false },
        { id: '6', name: 'Eşitsizlikler', completed: false },
        { id: '7', name: 'Fonksiyonlar', completed: false },
        { id: '8', name: 'Geometri', completed: false }
      ]
    },
    {
      id: '2',
      name: 'Türkçe',
      color: 'bg-red-500',
      icon: '📚',
      progress: 60,
      topics: [
        { id: '1', name: 'Ses Bilgisi', completed: true },
        { id: '2', name: 'Kelime Bilgisi', completed: true },
        { id: '3', name: 'Cümle Bilgisi', completed: true },
        { id: '4', name: 'Paragraf', completed: false },
        { id: '5', name: 'Metin Türleri', completed: false },
        { id: '6', name: 'Yazım Kuralları', completed: false },
        { id: '7', name: 'Noktalama İşaretleri', completed: false },
        { id: '8', name: 'Anlatım Bozuklukları', completed: false }
      ]
    },
    {
      id: '3',
      name: 'Fen Bilimleri',
      color: 'bg-green-500',
      icon: '🔬',
      progress: 45,
      topics: [
        { id: '1', name: 'Madde ve Değişim', completed: true },
        { id: '2', name: 'Kuvvet ve Hareket', completed: true },
        { id: '3', name: 'Enerji', completed: false },
        { id: '4', name: 'Işık ve Ses', completed: false },
        { id: '5', name: 'Elektrik', completed: false },
        { id: '6', name: 'Canlılar ve Yaşam', completed: false },
        { id: '7', name: 'İnsan ve Çevre', completed: false },
        { id: '8', name: 'Dünya ve Evren', completed: false }
      ]
    },
    {
      id: '4',
      name: 'Sosyal Bilgiler',
      color: 'bg-purple-500',
      icon: '🌍',
      progress: 80,
      topics: [
        { id: '1', name: 'Tarih', completed: true },
        { id: '2', name: 'Coğrafya', completed: true },
        { id: '3', name: 'Vatandaşlık', completed: true },
        { id: '4', name: 'Ekonomi', completed: true },
        { id: '5', name: 'Kültür', completed: false },
        { id: '6', name: 'Toplum', completed: false }
      ]
    },
    {
      id: '5',
      name: 'İngilizce',
      color: 'bg-yellow-500',
      icon: '🇬🇧',
      progress: 55,
      topics: [
        { id: '1', name: 'Grammar Basics', completed: true },
        { id: '2', name: 'Vocabulary', completed: true },
        { id: '3', name: 'Reading Comprehension', completed: true },
        { id: '4', name: 'Writing Skills', completed: false },
        { id: '5', name: 'Speaking Practice', completed: false },
        { id: '6', name: 'Listening Skills', completed: false },
        { id: '7', name: 'Tenses', completed: false },
        { id: '8', name: 'Phrasal Verbs', completed: false }
      ]
    }
  ]);

  const toggleTopic = (topicId: string) => {
    if (!selectedSubject) return;
    
    const updatedTopics = selectedSubject.topics.map(topic =>
      topic.id === topicId ? { ...topic, completed: !topic.completed } : topic
    );
    
    const completedCount = updatedTopics.filter(topic => topic.completed).length;
    const progress = Math.round((completedCount / updatedTopics.length) * 100);
    
    setSelectedSubject({
      ...selectedSubject,
      topics: updatedTopics,
      progress
    });
  };

  const getOverallProgress = () => {
    const totalTopics = subjects.reduce((sum, subject) => sum + subject.topics.length, 0);
    const completedTopics = subjects.reduce((sum, subject) => 
      sum + subject.topics.filter(topic => topic.completed).length, 0
    );
    return Math.round((completedTopics / totalTopics) * 100);
  };

  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/50"
          >
            <button
              onClick={() => setSelectedSubject(null)}
              className="flex items-center text-gray-600 hover:text-purple-600 mb-6 transition-all duration-300 group"
            >
              <div className="bg-gray-100 group-hover:bg-purple-100 rounded-full p-2 mr-3 transition-colors">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </div>
              <span className="font-medium">Geri Dön</span>
            </button>
            
            <div className="flex items-center mb-6">
              <div className={`w-20 h-20 ${selectedSubject.color} rounded-3xl flex items-center justify-center text-3xl mr-6 shadow-lg`}>
                {selectedSubject.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{selectedSubject.name}</h1>
                <p className="text-gray-600 text-lg font-medium">Konu İlerleme Takibi</p>
              </div>
              {selectedSubject.progress >= 80 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-3">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-gray-700">İlerleme Durumu</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{selectedSubject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedSubject.progress}%` }}
                  transition={{ duration: 1.5 }}
                  className={`h-4 rounded-full bg-gradient-to-r ${selectedSubject.color.replace('bg-', 'from-')} to-purple-500 shadow-sm`}
                ></motion.div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {selectedSubject.topics.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-emerald-700 font-medium">Tamamlanan Konu</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Circle className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {selectedSubject.topics.filter(t => !t.completed).length}
                </div>
                <div className="text-sm text-orange-700 font-medium">Kalan Konu</div>
              </div>
            </div>
          </motion.div>
          
          {/* Topics List */}
          <div className="space-y-4">
            {selectedSubject.topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => toggleTopic(topic.id)}
                className={`group bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:scale-[1.02] ${
                  topic.completed 
                    ? 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50' 
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 transition-all duration-300 ${
                      topic.completed 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg' 
                        : 'bg-gray-200 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400'
                    }`}>
                      {topic.completed ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-500 group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <div>
                      <span className={`text-lg font-semibold transition-colors ${
                        topic.completed ? 'text-emerald-800' : 'text-gray-900 group-hover:text-purple-700'
                      }`}>
                        {topic.name}
                      </span>
                      <p className={`text-sm mt-1 ${
                        topic.completed ? 'text-emerald-600' : 'text-gray-500'
                      }`}>
                        {topic.completed ? 'Başarıyla tamamlandı' : 'Henüz tamamlanmadı'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {topic.completed && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center"
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Tamamlandı
                      </motion.div>
                    )}
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      topic.completed 
                        ? 'bg-emerald-500 shadow-lg' 
                        : 'bg-gray-300 group-hover:bg-purple-400'
                    }`}></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-lg">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">Konu Analizi</h1>
          <p className="text-gray-600 text-lg">Hangi konularda ne kadar ilerlediğinizi takip edin ve hedeflerinize ulaşın</p>
        </motion.div>
        
        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 shadow-md text-center text-white transform hover:scale-105 transition-all duration-300"
          >
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-2">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div className="text-xl font-bold mb-1">{getOverallProgress()}%</div>
            <div className="text-blue-100 text-xs font-medium">Genel İlerleme</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-3 shadow-md text-center text-white transform hover:scale-105 transition-all duration-300"
          >
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-2">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div className="text-xl font-bold mb-1">{subjects.length}</div>
            <div className="text-emerald-100 text-xs font-medium">Toplam Ders</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 shadow-md text-center text-white transform hover:scale-105 transition-all duration-300"
          >
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="text-xl font-bold mb-1">
              {subjects.reduce((sum, subject) => sum + subject.topics.filter(t => t.completed).length, 0)}
            </div>
            <div className="text-purple-100 text-xs font-medium">Tamamlanan Konu</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-3 shadow-md text-center text-white transform hover:scale-105 transition-all duration-300"
          >
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <div className="text-xl font-bold mb-1">
              {subjects.filter(s => s.progress >= 80).length}
            </div>
            <div className="text-amber-100 text-xs font-medium">Başarılı Ders</div>
          </motion.div>
        </div>
        
        {/* Subjects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setSelectedSubject(subject)}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-white/50 hover:bg-white/90"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${subject.color} rounded-2xl flex items-center justify-center text-2xl mr-3 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {subject.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors truncate">{subject.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">{subject.topics.length} konu</p>
                </div>
              </div>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-700">İlerleme</span>
                  <div className="flex items-center">
                    {subject.progress >= 80 && <Star className="h-3 w-3 text-yellow-500 mr-1" />}
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{subject.progress}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.progress}%` }}
                    transition={{ duration: 1, delay: 0.2 * index }}
                    className={`h-2 rounded-full bg-gradient-to-r ${subject.color.replace('bg-', 'from-')} to-purple-500 shadow-sm`}
                  ></motion.div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-2 text-center">
                  <div className="text-lg font-bold text-emerald-600 mb-0">
                    {subject.topics.filter(t => t.completed).length}
                  </div>
                  <div className="text-xs text-emerald-700 font-medium">Tamam</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-2 text-center">
                  <div className="text-lg font-bold text-orange-600 mb-0">
                    {subject.topics.filter(t => !t.completed).length}
                  </div>
                  <div className="text-xs text-orange-700 font-medium">Kalan</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectAnalysis;