import React, { useState } from 'react';
import { ChevronRight, CheckCircle, Circle, BookOpen, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <button
              onClick={() => setSelectedSubject(null)}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
              <ChevronRight className="h-5 w-5 rotate-180 mr-2" />
              Geri Dön
            </button>
            
            <div className="flex items-center mb-4">
              <div className={`w-16 h-16 ${selectedSubject.color} rounded-2xl flex items-center justify-center text-2xl mr-4`}>
                {selectedSubject.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedSubject.name}</h1>
                <p className="text-gray-600">Konu İlerlemesi</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">İlerleme</span>
                <span className="text-sm font-bold text-gray-900">{selectedSubject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${selectedSubject.color} transition-all duration-500`}
                  style={{ width: `${selectedSubject.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {selectedSubject.topics.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-gray-600">Tamamlanan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {selectedSubject.topics.filter(t => !t.completed).length}
                </div>
                <div className="text-sm text-gray-600">Kalan</div>
              </div>
            </div>
          </div>
          
          {/* Topics List */}
          <div className="space-y-3">
            {selectedSubject.topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => toggleTopic(topic.id)}
                className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                  topic.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {topic.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 mr-3" />
                    )}
                    <span className={`font-medium ${
                      topic.completed ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {topic.name}
                    </span>
                  </div>
                  {topic.completed && (
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      Tamamlandı
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Konu Analizi</h1>
          <p className="text-gray-600">Hangi konularda ne kadar ilerlediğinizi takip edin</p>
        </div>
        
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{getOverallProgress()}%</div>
            <div className="text-sm text-gray-600">Genel İlerleme</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{subjects.length}</div>
            <div className="text-sm text-gray-600">Toplam Ders</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {subjects.reduce((sum, subject) => sum + subject.topics.filter(t => t.completed).length, 0)}
            </div>
            <div className="text-sm text-gray-600">Tamamlanan Konu</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {subjects.filter(s => s.progress >= 80).length}
            </div>
            <div className="text-sm text-gray-600">Başarılı Ders</div>
          </div>
        </div>
        
        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => setSelectedSubject(subject)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className={`w-14 h-14 ${subject.color} rounded-2xl flex items-center justify-center text-2xl mr-4`}>
                  {subject.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.topics.length} konu</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">İlerleme</span>
                  <span className="text-sm font-bold text-gray-900">{subject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${subject.color} transition-all duration-500`}
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {subject.topics.filter(t => t.completed).length}
                  </div>
                  <div className="text-xs text-gray-600">Tamamlanan</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">
                    {subject.topics.filter(t => !t.completed).length}
                  </div>
                  <div className="text-xs text-gray-600">Kalan</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectAnalysis;