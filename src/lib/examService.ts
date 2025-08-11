import { supabase, supabaseAdmin } from './supabase';

// Auth user'dan student ID'yi alma fonksiyonu
export async function getStudentIdFromAuthUser(authUserId: string): Promise<{ studentId: string; error: null }> {
  // Öğrenci giriş sisteminde student.id doğrudan auth store'da user.id olarak saklanıyor
  // Bu nedenle auth user'ın id'sini direkt student_id olarak kullanıyoruz
  return { studentId: authUserId, error: null };
}

export interface TYTExamData {
  examName: string;
  turkce: { correct: string; wrong: string };
  matematik: { correct: string; wrong: string };
  fen: { correct: string; wrong: string };
  sosyal: { correct: string; wrong: string };
}

export interface SingleSubjectExamData {
  examName: string;
  subject: string;
  correct: string;
  wrong: string;
  blank: string;
}

export interface StudentExam {
  id: string;
  student_id: string;
  exam_type: 'TYT' | 'AYT' | 'LGS';
  exam_date: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  empty_answers: number;
  score: number;
  net_score: number;
  subject_scores: any;
  created_at: string;
  updated_at: string;
}

// TYT denemesi kaydetme
export const saveTYTExam = async (studentId: string, examData: TYTExamData) => {
  try {
    const turkceCorrect = parseInt(examData.turkce.correct) || 0;
    const turkceWrong = parseInt(examData.turkce.wrong) || 0;
    const matematikCorrect = parseInt(examData.matematik.correct) || 0;
    const matematikWrong = parseInt(examData.matematik.wrong) || 0;
    const fenCorrect = parseInt(examData.fen.correct) || 0;
    const fenWrong = parseInt(examData.fen.wrong) || 0;
    const sosyalCorrect = parseInt(examData.sosyal.correct) || 0;
    const sosyalWrong = parseInt(examData.sosyal.wrong) || 0;

    const totalCorrect = turkceCorrect + matematikCorrect + fenCorrect + sosyalCorrect;
    const totalWrong = turkceWrong + matematikWrong + fenWrong + sosyalWrong;
    const totalQuestions = 120; // TYT toplam soru sayısı
    const emptyAnswers = totalQuestions - totalCorrect - totalWrong;
    const netScore = totalCorrect - (totalWrong * 0.25);
    const score = (netScore / totalQuestions) * 100;

    const subjectScores = {
      examName: examData.examName,
      turkce: { correct: turkceCorrect, wrong: turkceWrong },
      matematik: { correct: matematikCorrect, wrong: matematikWrong },
      fen: { correct: fenCorrect, wrong: fenWrong },
      sosyal: { correct: sosyalCorrect, wrong: sosyalWrong }
    };

    const { data, error } = await supabaseAdmin
      .from('student_exams')
      .insert({
        student_id: studentId,
        exam_type: 'TYT',
        exam_date: new Date().toISOString().split('T')[0],
        total_questions: totalQuestions,
        correct_answers: totalCorrect,
        wrong_answers: totalWrong,
        empty_answers: emptyAnswers,
        score: score,
        net_score: netScore,
        subject_scores: subjectScores
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('TYT deneme kaydetme hatası:', error);
    return { data: null, error };
  }
};

// AYT/LGS denemesi kaydetme
export const saveSingleSubjectExam = async (
  studentId: string, 
  examType: 'AYT' | 'LGS', 
  examData: SingleSubjectExamData
) => {
  try {
    const correct = parseInt(examData.correct) || 0;
    const wrong = parseInt(examData.wrong) || 0;
    const blank = parseInt(examData.blank) || 0;
    const totalQuestions = correct + wrong + blank;
    const netScore = correct - (wrong * 0.25);
    const score = totalQuestions > 0 ? (netScore / totalQuestions) * 100 : 0;

    const subjectScores = {
      examName: examData.examName,
      subject: examData.subject,
      correct: correct,
      wrong: wrong,
      blank: blank
    };

    const { data, error } = await supabaseAdmin
      .from('student_exams')
      .insert({
        student_id: studentId,
        exam_type: examType,
        exam_date: new Date().toISOString().split('T')[0],
        total_questions: totalQuestions,
        correct_answers: correct,
        wrong_answers: wrong,
        empty_answers: blank,
        score: score,
        net_score: netScore,
        subject_scores: subjectScores
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error(`${examType} deneme kaydetme hatası:`, error);
    return { data: null, error };
  }
};

// Öğrencinin denemelerini getirme
export const getStudentExams = async (studentId: string) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('student_exams')
      .select('*')
      .eq('student_id', studentId)
      .order('exam_date', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Deneme listesi getirme hatası:', error);
    return { data: null, error };
  }
};

// Deneme silme
export const deleteStudentExam = async (examId: string) => {
  try {
    const { error } = await supabaseAdmin
      .from('student_exams')
      .delete()
      .eq('id', examId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Deneme silme hatası:', error);
    return { error };
  }
};

// Deneme türüne göre istatistikler
export const getExamStatistics = async (studentId: string, examType?: 'TYT' | 'AYT' | 'LGS') => {
  try {
    let query = supabaseAdmin
      .from('student_exams')
      .select('*')
      .eq('student_id', studentId);

    if (examType) {
      query = query.eq('exam_type', examType);
    }

    const { data, error } = await query.order('exam_date', { ascending: false });

    if (error) throw error;

    // İstatistikleri hesapla
    const stats = {
      totalExams: data?.length || 0,
      averageNet: data?.length ? (data.reduce((sum, exam) => sum + exam.net_score, 0) / data.length).toFixed(2) : '0',
      bestNet: data?.length ? Math.max(...data.map(exam => exam.net_score)).toFixed(2) : '0',
      latestNet: data?.length ? data[0].net_score.toFixed(2) : '0',
      improvement: data?.length >= 2 ? (data[0].net_score - data[data.length - 1].net_score).toFixed(2) : '0'
    };

    return { data, stats, error: null };
  } catch (error) {
    console.error('Deneme istatistikleri getirme hatası:', error);
    return { data: null, stats: null, error };
  }
};