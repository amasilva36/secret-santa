import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, Shuffle } from 'lucide-react';
import { Button } from './Button';
import { Participant } from '../types';
import { MAX_PARTICIPANTS, PLACEHOLDERS } from '../constants';

interface InputPhaseProps {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onGenerate: () => void;
}

export const InputPhase: React.FC<InputPhaseProps> = ({ participants, setParticipants, onGenerate }) => {
  const [errors, setErrors] = useState<string[]>([]);

  const handleNameChange = (id: string, value: string) => {
    setParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, name: value } : p)
    );
    if (errors.length) setErrors([]);
  };

  const handleClear = () => {
    setParticipants(prev => prev.map(p => ({ ...p, name: '' })));
  };

  const handleFillSample = () => {
    setParticipants(prev => prev.map((p, i) => ({ ...p, name: PLACEHOLDERS[i] })));
    setErrors([]);
  };

  const validateAndSubmit = () => {
    const emptyNames = participants.filter(p => !p.name.trim());
    const names = participants.map(p => p.name.trim().toLowerCase());
    const duplicates = names.filter((item, index) => names.indexOf(item) !== index && item !== '');

    const newErrors: string[] = [];
    if (emptyNames.length > 0) newErrors.push("Todos os campos devem ser preenchidos.");
    if (duplicates.length > 0) newErrors.push("Todos os nomes devem ser únicos.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      onGenerate();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800">Participantes ({participants.length})</h2>
        <div className="flex gap-2">
           <button onClick={handleFillSample} className="text-xs font-medium text-brand-600 hover:text-brand-700 hover:underline px-2 py-1 rounded">
            Preencher
          </button>
          <button onClick={handleClear} className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1 rounded">
            Limpar
          </button>
        </div>
      </div>
      
      <div className="p-8 space-y-4">
        {participants.map((p, index) => (
          <div key={p.id} className="group relative flex items-center">
            <span className="absolute left-4 text-slate-400 font-mono text-sm select-none pointer-events-none">
              0{index + 1}
            </span>
            <input
              type="text"
              value={p.name}
              onChange={(e) => handleNameChange(p.id, e.target.value)}
              placeholder={`Nome da Pessoa ${index + 1}`}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all duration-200 outline-none"
            />
          </div>
        ))}

        {errors.length > 0 && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex flex-col gap-1 animate-fade-in">
            {errors.map((err, i) => <span key={i}>• {err}</span>)}
          </div>
        )}
      </div>

      <div className="px-8 pb-8">
        <Button 
          fullWidth 
          onClick={validateAndSubmit} 
          icon={<Sparkles className="w-5 h-5" />}
          className="h-14 text-lg shadow-brand-500/25 shadow-lg"
        >
          Realizar Sorteio
        </Button>
        <p className="text-center text-slate-400 text-xs mt-4">
          Isso sorteará os nomes com segurança. Nenhum dado sai do seu dispositivo.
        </p>
      </div>
    </div>
  );
};