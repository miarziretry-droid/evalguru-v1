import React, { useState } from 'react';
import { Search, Globe, ExternalLink, Loader2 } from 'lucide-react';
import * as geminiService from '../services/geminiService';

const RegulationSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{text: string, sources: any[]} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    const data = await geminiService.searchRegulations(query);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Standar & Regulasi Pendidikan</h1>
        <p className="text-blue-100 mb-6">
          Gunakan kekuatan AI yang terhubung dengan Google Search untuk mencari peraturan terbaru, Kurikulum Merdeka, dan standar kompetensi guru.
        </p>

        <form onSubmit={handleSearch} className="relative">
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh: Apa standar kompetensi guru terbaru di kurikulum merdeka?"
                className="w-full pl-5 pr-14 py-4 rounded-xl text-slate-800 shadow-lg focus:ring-4 focus:ring-blue-400/50 outline-none transition-shadow"
            />
            <button 
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bg-blue-800 hover:bg-blue-900 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Search />}
            </button>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
             <Loader2 size={40} className="animate-spin mb-4 text-blue-600" />
             <p>Sedang mencari informasi terbaru di web...</p>
        </div>
      )}

      {result && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
            <div className="flex items-center space-x-2 text-green-700 font-bold mb-4 border-b pb-2 border-slate-100">
                <Globe size={20} />
                <span>Hasil Pencarian (Grounded)</span>
            </div>
            
            <div className="prose prose-slate max-w-none mb-6">
                <p className="whitespace-pre-wrap">{result.text}</p>
            </div>

            {result.sources && result.sources.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Sumber Referensi</h4>
                    <div className="grid gap-2">
                        {result.sources.map((chunk, idx) => (
                             chunk.web?.uri ? (
                                <a 
                                    key={idx} 
                                    href={chunk.web.uri} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded hover:border-blue-400 hover:text-blue-600 transition-all text-sm group"
                                >
                                    <span className="truncate flex-1 font-medium">{chunk.web.title || chunk.web.uri}</span>
                                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 ml-2" />
                                </a>
                             ) : null
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default RegulationSearch;