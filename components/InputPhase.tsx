import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, User } from 'lucide-react';
import { Button } from './Button';
import { Participant } from '../types';
import { MIN_PARTICIPANTS } from '../constants';

interface InputPhaseProps {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  onGenerate: () => void;
  addParticipant: () => void;
  removeParticipant: (id: string) => void;
}

export const InputPhase: React.FC<InputPhaseProps> = ({ 
  participants, 
  setParticipants, 
  onGenerate,
  addParticipant,
  removeParticipant
}) => {
  const [errors, setErrors] = useState<string[]>([]);

  const handleNameChange = (id: string, value: string) => {
    setParticipants(prev => 
      prev.map(p => p.id === id ? { ...p, name: value } : p)
    );
    if (errors.length) setErrors([]);
  };

  const validateAndSubmit = () => {
    const emptyNames = participants.filter(p => !p.name.trim());
    const names = participants.map(p => p.name.trim().toLowerCase());
    const duplicates = names.filter((item, index) => names.indexOf(item) !== index && item !== '');

    const newErrors: string[] = [];
    if (participants.length < MIN_PARTICIPANTS) {
      newErrors.push(`Mínimo de ${MIN_PARTICIPANTS} participantes necessário.`);
    }
    if (emptyNames.length > 0) newErrors.push("Todos os campos devem ser preenchidos.");
    if (duplicates.length > 0) newErrors.push("Todos os nomes devem ser únicos.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      onGenerate();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-600" />
          Participantes ({participants.length})
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          O primeiro nome é o Organizador (Você).
        </p>
      </div>
      
      <div className="p-8 space-y-3">
        {participants.map((p, index) => (
          <div key={p.id} className="group relative flex items-center animate-fade-in">
            <span className={`absolute left-4 font-mono text-sm select-none pointer-events-none ${index === 0 ? 'text-brand-600 font-bold' : 'text-slate-400'}`}>
              {index === 0 ? '★' : String(index + 1).padStart(2, '0')}
            </span>
            <input
              type="text"
              value={p.name}
              onChange={(e) => handleNameChange(p.id, e.target.value)}
              placeholder={index === 0 ? "Seu Nome (Organizador)" : `Nome da Pessoa ${index + 1}`}
              className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 transition-all duration-200 outline-none
                ${index === 0 ? 'border-brand-200 focus:border-brand-500 focus:ring-brand-500/10' : 'border-slate-200 focus:border-slate-400 focus:ring-slate-200'}
              `}
            />
            {index > 0 && (
              <button 
                onClick={() => removeParticipant(p.id)}
                className="absolute right-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remover"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addParticipant}
          className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/50 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Adicionar Participante
        </button>

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