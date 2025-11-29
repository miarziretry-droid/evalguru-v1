import React, { useState } from 'react';
import { Teacher, AssessmentScores } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { BrainCircuit, Sparkles, Printer, ArrowLeft, Loader2, FileText, Check } from 'lucide-react';
import * as geminiService from '../services/geminiService';

interface ResultViewProps {
  teacher: Teacher;
  onBack: () => void;
  onUpdateTeacher: (updatedTeacher: Teacher) => void;
}

const ResultView: React.FC<ResultViewProps> = ({ teacher, onBack, onUpdateTeacher }) => {
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingDeep, setLoadingDeep] = useState(false);

  if (!teacher.scores) return <div>Data tidak ditemukan</div>;

  const data = [
    { subject: 'Pedagogik', A: teacher.scores.pedagogik, fullMark: 100 },
    { subject: 'Kepribadian', A: teacher.scores.kepribadian, fullMark: 100 },
    { subject: 'Sosial', A: teacher.scores.sosial, fullMark: 100 },
    { subject: 'Profesional', A: teacher.scores.profesional, fullMark: 100 },
  ];

  const overallScore = Math.round(
    (teacher.scores.pedagogik + teacher.scores.kepribadian + teacher.scores.sosial + teacher.scores.profesional) / 4
  );

  const handleGenerateSummary = async () => {
    if (!teacher.scores) return;
    setLoadingSummary(true);
    const summary = await geminiService.generateQuickSummary(teacher.name, teacher.scores);
    onUpdateTeacher({ ...teacher, aiSummary: summary });
    setLoadingSummary(false);
  };

  const handleDeepAnalysis = async () => {
    if (!teacher.scores) return;
    setLoadingDeep(true);
    const analysis = await geminiService.generateDeepAnalysis(teacher.name, teacher.subject, teacher.scores);
    onUpdateTeacher({ ...teacher, aiDeepAnalysis: analysis });
    setLoadingDeep(false);
  };

  return (
    <div className="space-y-6 animate-fade-in print:space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Daftar
        </button>
        <button 
            onClick={() => window.print()} 
            className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 print:hidden">
          <Printer size={18} />
          <span>Cetak Laporan</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 print:shadow-none print:border-0 print:p-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-100 pb-6 print:flex-row print:mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 print:text-2xl">{teacher.name}</h1>
            <p className="text-slate-500 text-lg print:text-base">{teacher.subject} • NIP: {teacher.nip}</p>
          </div>
          <div className="mt-4 md:mt-0 text-right print:mt-0">
            <div className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Skor Akhir</div>
            <div className={`text-4xl font-bold ${overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {overallScore}/100
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 print:grid-cols-2 print:gap-4 print:mb-4">
          {/* Radar Chart */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col items-center justify-center h-80 print:h-64 print:border-slate-300">
            <h3 className="text-sm font-semibold text-slate-500 mb-2 w-full text-center uppercase">Peta Kompetensi</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={teacher.name} dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart Summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 h-80 print:h-64 print:border-slate-300">
            <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase text-center">Detail Nilai</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="subject" type="category" width={80} tick={{ fontSize: 11 }} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="A" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#1e293b', fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Section */}
        <div className="grid grid-cols-1 gap-8 print:gap-4 print:block">
            
          {/* Quick Summary (Flash Lite) */}
          <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-6 print:break-inside-avoid print:mb-4 print:border-slate-300 print:bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-indigo-700 print:text-slate-800">
                <Sparkles size={20} />
                <h3 className="font-bold text-lg">Ringkasan Eksekutif</h3>
              </div>
              {!teacher.aiSummary && (
                <button 
                  onClick={handleGenerateSummary}
                  disabled={loadingSummary}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center print:hidden"
                >
                  {loadingSummary ? <Loader2 className="animate-spin mr-2" size={16} /> : <Sparkles size={16} className="mr-2" />}
                  Generate Ringkasan
                </button>
              )}
            </div>
            
            {loadingSummary && (
               <div className="h-20 flex items-center justify-center text-indigo-400 print:hidden">
                 <Loader2 className="animate-spin mr-2" /> Sedang menulis ringkasan...
               </div>
            )}
            
            {teacher.aiSummary && (
              <div className="prose prose-sm max-w-none text-slate-700 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm print:shadow-none print:border-0 print:p-0">
                <p>{teacher.aiSummary}</p>
              </div>
            )}
          </div>

          {/* Deep Analysis (Thinking Mode) */}
          <div className="border border-purple-100 bg-purple-50/50 rounded-xl p-6 print:break-inside-avoid print:border-slate-300 print:bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-purple-700 print:text-slate-800">
                <BrainCircuit size={20} />
                <h3 className="font-bold text-lg">Analisis Mendalam & Strategi</h3>
              </div>
              {!teacher.aiDeepAnalysis && (
                <button 
                  onClick={handleDeepAnalysis}
                  disabled={loadingDeep}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center print:hidden"
                >
                  {loadingDeep ? <Loader2 className="animate-spin mr-2" size={16} /> : <BrainCircuit size={16} className="mr-2" />}
                  Analisis Strategis
                </button>
              )}
            </div>

            {loadingDeep && (
               <div className="h-24 flex flex-col items-center justify-center text-purple-500 print:hidden">
                 <div className="flex items-center mb-2">
                    <Loader2 className="animate-spin mr-2" /> 
                    <span className="font-medium">AI sedang berpikir mendalam...</span>
                 </div>
                 <p className="text-xs opacity-70">Model Gemini 3.0 Pro sedang menganalisis pola kompetensi.</p>
               </div>
            )}

            {teacher.aiDeepAnalysis && (
              <div className="prose prose-purple max-w-none text-slate-800 bg-white p-6 rounded-lg border border-purple-100 shadow-sm whitespace-pre-wrap print:shadow-none print:border-0 print:p-0">
                {teacher.aiDeepAnalysis}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultView;