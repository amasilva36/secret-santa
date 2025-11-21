import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputPhase } from './components/InputPhase';
import { RevealPhase } from './components/RevealPhase';
import { generateAssignments } from './utils/santaLogic';
import { Participant, Assignment, AppStage } from './types';
import { MAX_PARTICIPANTS } from './constants';

// Simple unique ID generator that works in non-secure contexts
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to create initial empty slots
const createInitialParticipants = (): Participant[] => 
  Array.from({ length: MAX_PARTICIPANTS }, () => ({
    id: generateId(),
    name: ''
  }));

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INPUT);
  const [participants, setParticipants] = useState<Participant[]>(createInitialParticipants());
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const handleGenerate = () => {
    // Filter out empty names just in case, though validation handles this
    const validParticipants = participants.filter(p => p.name.trim() !== '');
    
    // Generate logic
    const result = generateAssignments(validParticipants);
    
    if (result) {
      setAssignments(result);
      setStage(AppStage.REVEAL);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("Não foi possível gerar pares válidos. Tente novamente com mais nomes (mínimo 3).");
    }
  };

  const handleReset = () => {
    // Reset immediately without confirmation since the event is concluded
    setStage(AppStage.INPUT);
    setParticipants(createInitialParticipants());
    setAssignments([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Header />
      
      <main className="container mx-auto px-4">
        <div className="transition-all duration-500 ease-in-out">
          {stage === AppStage.INPUT && (
            <InputPhase 
              participants={participants} 
              setParticipants={setParticipants} 
              onGenerate={handleGenerate} 
            />
          )}

          {stage === AppStage.REVEAL && (
            <RevealPhase 
              assignments={assignments} 
              onReset={handleReset} 
            />
          )}
        </div>
      </main>

      {/* Footer / Credits */}
      <footer className="text-center text-slate-400 text-xs py-8 mt-8">
        <p>&copy; {new Date().getFullYear()} Amigo Secreto. Seguro & Local.</p>
      </footer>
    </div>
  );
};

export default App;