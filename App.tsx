import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TeacherList from './components/TeacherList';
import AssessmentForm from './components/AssessmentForm';
import ResultView from './components/ResultView';
import RegulationSearch from './components/RegulationSearch';
import ChatAssistant from './components/ChatAssistant';
import { Teacher, ViewState, AssessmentScores } from './types';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  // Load sample data on mount if empty
  useEffect(() => {
    const saved = localStorage.getItem('evalguru_teachers');
    if (saved) {
      setTeachers(JSON.parse(saved));
    } else {
        const samples: Teacher[] = [
            { id: '1', name: 'Budi Santoso', nip: '198001012010011001', subject: 'Matematika', status: 'pending' },
            { id: '2', name: 'Siti Aminah', nip: '198505052015022003', subject: 'Bahasa Indonesia', status: 'pending' },
            { id: '3', name: 'Ahmad Dahlan', nip: '197902022005011002', subject: 'Fisika', status: 'pending' },
        ];
        setTeachers(samples);
        localStorage.setItem('evalguru_teachers', JSON.stringify(samples));
    }
  }, []);

  // Save to local storage whenever teachers change
  useEffect(() => {
    if (teachers.length > 0) {
      localStorage.setItem('evalguru_teachers', JSON.stringify(teachers));
    }
  }, [teachers]);

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers([...teachers, newTeacher]);
  };

  const handleSelectTeacher = (id: string) => {
    setSelectedTeacherId(id);
    setView('assess');
  };

  const handleCompleteAssessment = (id: string, scores: AssessmentScores) => {
    const updatedTeachers = teachers.map(t => 
        t.id === id ? { ...t, scores, status: 'evaluated' as const, evaluationDate: new Date().toISOString() } : t
    );
    setTeachers(updatedTeachers);
    setView('result');
  };

  const handleUpdateTeacher = (updated: Teacher) => {
    setTeachers(teachers.map(t => t.id === updated.id ? updated : t));
  };

  const getSelectedTeacher = () => teachers.find(t => t.id === selectedTeacherId);

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <TeacherList 
            teachers={teachers} 
            onAddTeacher={handleAddTeacher} 
            onSelectTeacher={handleSelectTeacher}
            onViewResult={(id) => { setSelectedTeacherId(id); setView('result'); }}
          />
        );
      case 'assess':
        const tToAssess = getSelectedTeacher();
        if (!tToAssess) return <div>Teacher not found</div>;
        return (
          <AssessmentForm 
            teacher={tToAssess} 
            onComplete={handleCompleteAssessment} 
            onCancel={() => setView('dashboard')} 
          />
        );
      case 'result':
        const tResult = getSelectedTeacher();
        if (!tResult) return <div>Teacher not found</div>;
        return (
          <ResultView 
            teacher={tResult} 
            onBack={() => setView('dashboard')}
            onUpdateTeacher={handleUpdateTeacher}
          />
        );
      case 'regulations':
        return <RegulationSearch />;
      case 'chat':
        return <ChatAssistant />;
      default:
        return <div>Not Implemented</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 p-4 md:hidden flex justify-between items-center shadow-sm z-10 print:hidden">
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold">E</div>
             <span className="font-bold text-slate-800">EvalGuru</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
               {renderContent()}
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;