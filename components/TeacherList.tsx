import React, { useState } from 'react';
import { Teacher } from '../types';
import { Plus, User, ClipboardList, CheckCircle2, ChevronRight, Search } from 'lucide-react';

interface TeacherListProps {
  teachers: Teacher[];
  onAddTeacher: (t: Teacher) => void;
  onSelectTeacher: (id: string) => void;
  onViewResult: (id: string) => void;
}

const TeacherList: React.FC<TeacherListProps> = ({ teachers, onAddTeacher, onSelectTeacher, onViewResult }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', nip: '', subject: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeacher.name && newTeacher.subject) {
      onAddTeacher({
        id: Date.now().toString(),
        name: newTeacher.name,
        nip: newTeacher.nip,
        subject: newTeacher.subject,
        status: 'pending',
      });
      setNewTeacher({ name: '', nip: '', subject: '' });
      setIsAdding(false);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Guru</h1>
          <p className="text-slate-500">Kelola daftar guru dan status evaluasi.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors"
        >
          <Plus size={20} />
          <span>Tambah Guru</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 animate-fade-in mb-6">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Input Data Guru Baru</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newTeacher.name}
              onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="NIP (Nomor Induk)"
              className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newTeacher.nip}
              onChange={e => setNewTeacher({...newTeacher, nip: e.target.value})}
            />
            <input
              type="text"
              placeholder="Mata Pelajaran (Contoh: Matematika)"
              className="border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newTeacher.subject}
              onChange={e => setNewTeacher({...newTeacher, subject: e.target.value})}
              required
            />
            <div className="md:col-span-3 flex justify-end space-x-3 mt-2">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-700"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari guru berdasarkan nama atau mapel..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.map(teacher => (
          <div key={teacher.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${teacher.status === 'evaluated' ? 'bg-green-500' : 'bg-slate-400'}`}>
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{teacher.name}</h3>
                  <p className="text-sm text-slate-500">{teacher.subject}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${teacher.status === 'evaluated' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {teacher.status === 'evaluated' ? 'Selesai' : 'Pending'}
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">NIP: {teacher.nip || '-'}</span>
                
                {teacher.status === 'evaluated' ? (
                  <button 
                    onClick={() => onViewResult(teacher.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                  >
                    Lihat Hasil <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={() => onSelectTeacher(teacher.id)}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm flex items-center transition-colors"
                  >
                    <ClipboardList size={16} className="mr-2" />
                    Mulai Evaluasi
                  </button>
                )}
            </div>
          </div>
        ))}
        
        {filteredTeachers.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
                <p>Belum ada data guru yang ditemukan.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;