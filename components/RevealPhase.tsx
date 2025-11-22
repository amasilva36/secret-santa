import React, { useState } from 'react';
import { Assignment } from '../types';
import { Button } from './Button';
import { Eye, EyeOff, Share2, Send, RefreshCw, MessageCircle } from 'lucide-react';

interface RevealPhaseProps {
  assignments: Assignment[];
  onReset: () => void;
}

export const RevealPhase: React.FC<RevealPhaseProps> = ({ assignments, onReset }) => {
  const [revealedOrganizer, setRevealedOrganizer] = useState(false);

  const createSpoilerMessage = (giver: string, receiver: string) => {
    // Zero Width Space (invisível) para forçar o "Ler mais"
    // 800 é um valor seguro que ativa o gatilho na maioria dos dispositivos
    const zwsp = '\u200B'; 
    
    // 1. Cabeçalho (Visível no topo)
    const header = `🎁 Olá ${giver}!`;
    
    // 2. Aviso curto
    const instruction = `\n\n⬇️ Toca em "Ler mais" para ver ⬇️\n`;

    // 3. Escudo Superior (Top Shield)
    // Reduzido de 8 para 6 linhas conforme solicitado
    const topPadding = zwsp.repeat(800) + "\n".repeat(6);
    
    // 4. Conteúdo Secreto (O Recheio)
    // Aumentado linhas após o nome (de 8 para 10) conforme solicitado
    const content = `\n🤫 O teu Amigo Secreto é:\n\n✨ ${receiver} ✨\n\n\n\n\n\n\n\n\n\n(Guarda segredo!)`;

    // 5. Rodapé (Sem espaços extra)
    const footer = "\n\n🎄 Boas Festas! 🎄";
    
    return `${header}${instruction}${topPadding}${content}${footer}`;
  };

  const handleShare = async (assignment: Assignment) => {
    const message = createSpoilerMessage(assignment.giver.name, assignment.receiver.name);

    if (navigator.share) {
      try {
        await navigator.share({
          text: message,
        });
      } catch (err) {
        console.log('Partilha cancelada');
      }
    } else {
      // Fallback for Desktop or unsupported browsers
      const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
          <Share2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Sorteio Realizado!</h2>
        <p className="text-slate-500 mt-2">
          Envie as mensagens para cada participante.
        </p>
        <div className="mt-4 bg-orange-50 border border-orange-100 rounded-lg p-3 text-sm text-orange-800 max-w-md mx-auto text-left">
          <p className="font-bold mb-1 flex items-center gap-2">
            <span className="text-lg">⚠️</span> 
            Atenção Organizador:
          </p>
          <ul className="list-disc list-inside space-y-1 text-orange-700/90 text-xs">
            <li>Use a partilha nativa do telemóvel (não copie/cole o texto se possível).</li>
            <li>O nome do amigo secreto está escondido após o "Ler mais".</li>
            <li>Cuidado: Se o cursor saltar para o fim da mensagem, o nome estará visível.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment, index) => {
          const isOrganizer = index === 0;

          if (isOrganizer) {
            return (
              <div key={assignment.giver.id} className="bg-white border-2 border-brand-100 rounded-2xl p-6 shadow-lg shadow-brand-100/50 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg uppercase tracking-wide">
                  Você
                </div>
                <div className="flex flex-col items-center text-center">
                  <h3 className="font-semibold text-slate-800 text-lg mb-1">{assignment.giver.name}</h3>
                  <p className="text-sm text-slate-500 mb-4">Seu amigo secreto é...</p>
                  
                  {!revealedOrganizer ? (
                    <Button onClick={() => setRevealedOrganizer(true)} variant="primary" className="w-full sm:w-auto">
                      <Eye className="w-4 h-4 mr-2" />
                      Revelar Meu Par
                    </Button>
                  ) : (
                    <div className="animate-scale-in flex flex-col items-center w-full">
                      <div className="text-2xl font-bold text-brand-600 bg-brand-50 border border-brand-200 rounded-xl py-3 px-8 mb-3 w-full sm:w-auto">
                        {assignment.receiver.name}
                      </div>
                      <Button onClick={() => setRevealedOrganizer(false)} variant="ghost" className="text-xs h-8">
                        <EyeOff className="w-3 h-3 mr-1" />
                        Esconder
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // Other participants
          return (
            <div key={assignment.giver.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-medium text-slate-800">{assignment.giver.name}</h4>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Mensagem pronta</span>
                </div>
              </div>
              
              <button
                onClick={() => handleShare(assignment)}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm shadow-sm active:scale-95 transform"
                title="Enviar Mensagem via WhatsApp"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" onClick={onReset} icon={<RefreshCw className="w-4 h-4"/>}>
          Novo Sorteio
        </Button>
        <p className="text-xs text-slate-400 mt-2">Isso apagará o sorteio atual.</p>
      </div>
    </div>
  );
};