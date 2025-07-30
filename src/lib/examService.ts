import { supabase } from './supabase';

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
  exam_name: string;
  exam_date: string;
  turkce_correct?: number;
  turkce_wrong?: number;
  matematik_correct?: number;
  matematik_wrong?: number;
  fen_correct?: number;
  fen_wrong?: number;
  sosyal_correct?: number;
  sosyal_wrong?: number;
  subject_name?: string;
  correct_answers?: number;
  wrong_answers?: number;
  blank_answers?: number;
  total_correct: number;
  total_wrong: number;
  total_net: number;
  created_at: string;
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
    const totalNet = totalCorrect - (totalWrong / 4);

    const { data, error } = await supabase
      .from('student_exams')
      .insert({
        student_id: studentId,
        exam_type: 'TYT',
        exam_name: examData.examName,
        turkce_correct: turkceCorrect,
        turkce_wrong: turkceWrong,
        matematik_correct: matematikCorrect,
        matematik_wrong: matematikWrong,
        fen_correct: fenCorrect,
        fen_wrong: fenWrong,
        sosyal_correct: sosyalCorrect,
        sosyal_wrong: sosyalWrong,
        total_correct: totalCorrect,
        total_wrong: totalWrong,
        total_net: totalNet
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
    const net = correct - (wrong / 4);

    const { data, error } = await supabase
      .from('student_exams')
      .insert({
        student_id: studentId,
        exam_type: examType,
        exam_name: examData.examName,
        subject_name: examData.subject,
        correct_answers: correct,
        wrong_answers: wrong,
        blank_answers: blank,
        total_correct: correct,
        total_wrong: wrong,
        total_net: net
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
    const { data, error } = await supabase
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
    const { error } = await supabase
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
    let query = supabase
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
      averageNet: data?.length ? (data.reduce((sum, exam) => sum + exam.total_net, 0) / data.length).toFixed(2) : '0',
      bestNet: data?.length ? Math.max(...data.map(exam => exam.total_net)).toFixed(2) : '0',
      latestNet: data?.length ? data[0].total_net.toFixed(2) : '0',
      improvement: data?.length >= 2 ? (data[0].total_net - data[1].total_net).toFixed(2) : '0'
    };

    return { data, stats, error: null };
  } catch (error) {
    console.error('Deneme istatistikleri getirme hatası:', error);
    return { data: null, stats: null, error };
  }
};