import React, { useState } from 'react';
import { Teacher, AssessmentScores } from '../types';
import { Save, ArrowRight, CheckCircle } from 'lucide-react';

interface AssessmentFormProps {
  teacher: Teacher;
  onComplete: (teacherId: string, scores: AssessmentScores) => void;
  onCancel: () => void;
}

const questions = [
  // Pedagogik
  { id: 1, category: 'pedagogik', text: 'Guru memahami karakteristik peserta didik dari aspek fisik, moral, sosial, kultural, emosional, dan intelektual.' },
  { id: 2, category: 'pedagogik', text: 'Guru merancang pembelajaran yang mendidik dan kreatif sesuai kebutuhan siswa.' },
  { id: 3, category: 'pedagogik', text: 'Guru memanfaatkan teknologi informasi dan komunikasi untuk kepentingan pembelajaran.' },
  // Kepribadian
  { id: 4, category: 'kepribadian', text: 'Guru bertindak sesuai dengan norma agama, hukum, sosial, dan kebudayaan nasional.' },
  { id: 5, category: 'kepribadian', text: 'Guru menunjukkan etos kerja, tanggung jawab yang tinggi, dan rasa bangga menjadi guru.' },
  // Sosial
  { id: 6, category: 'sosial', text: 'Guru bersikap inklusif, bertindak objektif, serta tidak diskriminatif.' },
  { id: 7, category: 'sosial', text: 'Guru berkomunikasi secara efektif, empatik, dan santun dengan sesama pendidik, orang tua, dan masyarakat.' },
  // Profesional
  { id: 8, category: 'profesional', text: 'Guru menguasai materi, struktur, konsep, dan pola pikir keilmuan yang mendukung mata pelajaran.' },
  { id: 9, category: 'profesional', text: 'Guru mengembangkan keprofesionalan secara berkelanjutan dengan melakukan tindakan reflektif.' },
  { id: 10, category: 'profesional', text: 'Guru menggunakan standar penilaian yang sesuai dengan kurikulum yang berlaku.' },
];

const AssessmentForm: React.FC<AssessmentFormProps> = ({ teacher, onComplete, onCancel }) => {
  // Store raw answers (1-5 scale)
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleSelect = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScores = (): AssessmentScores => {
    const scores: any = { pedagogik: 0, kepribadian: 0, sosial: 0, profesional: 0 };
    const counts: any = { pedagogik: 0, kepribadian: 0, sosial: 0, profesional: 0 };

    questions.forEach(q => {
      const val = answers[q.id] || 0;
      scores[q.category as string] += val;
      counts[q.category as string] += 1;
    });

    // Convert avg (1-5) to scale 0-100
    return {
      pedagogik: Math.round((scores.pedagogik / counts.pedagogik) * 20),
      kepribadian: Math.round((scores.kepribadian / counts.kepribadian) * 20),
      sosial: Math.round((scores.sosial / counts.sosial) * 20),
      profesional: Math.round((scores.profesional / counts.profesional) * 20),
    };
  };

  const isComplete = questions.every(q => answers[q.id]);

  const handleSubmit = () => {
    if (!isComplete) return;
    const finalScores = calculateScores();
    onComplete(teacher.id, finalScores);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-blue-600 p-6 text-white">
        <h2 className="text-2xl font-bold">Formulir Asesmen Kinerja Guru (PKG)</h2>
        <p className="opacity-90">Evaluasi untuk: <span className="font-semibold">{teacher.name}</span> ({teacher.subject})</p>
      </div>

      <div className="p-6 space-y-8">
        <p className="text-sm text-slate-500 italic">
          Instruksi: Berikan penilaian skala 1 (Sangat Kurang) hingga 5 (Sangat Baik) untuk setiap pernyataan di bawah ini.
        </p>

        {questions.map((q, index) => (
          <div key={q.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                {q.category}
              </span>
              <span className="text-slate-400 text-xs">#{index + 1}</span>
            </div>
            <p className="text-slate-800 font-medium mb-4">{q.text}</p>
            
            <div className="flex gap-2 sm:gap-4">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => handleSelect(q.id, val)}
                  className={`
                    flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all
                    ${answers[q.id] === val 
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50'}
                  `}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-100">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-lg font-bold text-white transition-all
              ${isComplete ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-slate-300 cursor-not-allowed'}
            `}
          >
            <Save size={18} />
            <span>Simpan Evaluasi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;