export interface Teacher {
  id: string;
  name: string;
  nip: string; // Nomor Induk Pegawai
  subject: string;
  status: 'pending' | 'evaluated';
  evaluationDate?: string;
  scores?: AssessmentScores;
  aiSummary?: string;
  aiDeepAnalysis?: string;
}

export interface AssessmentScores {
  pedagogik: number;   // Pedagogic
  kepribadian: number; // Personality
  sosial: number;      // Social
  profesional: number; // Professional
}

export interface Question {
  id: number;
  category: keyof AssessmentScores;
  text: string;
}

export type ViewState = 'dashboard' | 'assess' | 'result' | 'chat' | 'regulations';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}