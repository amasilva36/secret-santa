import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputPhase } from './components/InputPhase';
import { RevealPhase } from './components/RevealPhase';
import { generateAssignments } from './utils/santaLogic';
import { Participant, Assignment, AppStage } from './types';

// Simple unique ID generator that works in non-secure contexts
const generateId = () => Math.random().toString(36).substr(2, 9);

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INPUT);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: generateId(), name: '' } // Start with 1 (Organizer)
  ]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const addParticipant = () => {
    setParticipants(prev => [...prev, { id: generateId(), name: '' }]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleGenerate = () => {
    // Filter out empty names
    const validParticipants = participants.filter(p => p.name.trim() !== '');
    
    // Generate logic
    const result = generateAssignments(validParticipants);
    
    if (result) {
      setAssignments(result);
      setStage(AppStage.REVEAL);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("Não foi possível gerar pares válidos. Tente novamente.");
    }
  };

  const handleReset = () => {
    setStage(AppStage.INPUT);
    setParticipants([{ id: generateId(), name: '' }]); // Reset to just organizer
    setAssignments([]);
  };

  // Render Organizer View
  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <Header />
      
      <main className="container mx-auto px-4">
        <div className="transition-all duration-500 ease-in-out">
          {stage === AppStage.INPUT && (
            <InputPhase 
              participants={participants} 
              setParticipants={setParticipants} 
              addParticipant={addParticipant}
              removeParticipant={removeParticipant}
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