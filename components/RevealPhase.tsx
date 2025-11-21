import React, { useState } from 'react';
import { Assignment } from '../types';
import { Button } from './Button';
import { Eye, EyeOff, CheckCircle, RotateCcw, Lock, MessageCircle, Smartphone, Share2 } from 'lucide-react';

interface RevealPhaseProps {
  assignments: Assignment[];
  onReset: () => void;
}

export const RevealPhase: React.FC<RevealPhaseProps> = ({ assignments, onReset }) => {
  // Track which cards have been fully viewed/acknowledged
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  
  // The participant ID currently being viewed in the modal
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(null);
  
  // Whether the result is currently visible inside the modal
  const [isRevealed, setIsRevealed] = useState(false);

  const handleCardClick = (assignment: Assignment) => {
    if (completedIds.has(assignment.giver.id)) return;
    setActiveParticipantId(assignment.giver.id);
    setIsRevealed(false);
  };

  const activeAssignment = assignments.find(a => a.giver.id === activeParticipantId);

  const handleConfirmReveal = () => {
    setIsRevealed(true);
  };

  const handleCloseModal = () => {
    if (activeParticipantId) {
      setCompletedIds(prev => new Set(prev).add(activeParticipantId));
    }
    setActiveParticipantId(null);
    setIsRevealed(false);
  };

  const getShareMessage = () => {
    if (!activeAssignment) return '';
    return `Olá ${activeAssignment.giver.name}! 🎅 O teu Amigo Secreto é: ${activeAssignment.receiver.name} 🎁. Shhh!`;
  };

  const handleWhatsApp = () => {
    const message = getShareMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSMS = () => {
    const message = getShareMessage();
    const ua = navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(ua);
    // iOS separator is usually '&', others '?'
    const separator = isiOS ? '&' : '?';
    const url = `sms:${separator}body=${encodeURIComponent(message)}`;
    window.open(url, '_self');
  };

  const handleNativeShare = async () => {
    const message = getShareMessage();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Amigo Secreto',
          text: message,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to WhatsApp if native share fails or isn't supported
      handleWhatsApp();
    }
  };

  const allCompleted = completedIds.size === assignments.length;
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">A Revelação</h2>
          <p className="text-slate-500 text-sm mt-1">Passe o dispositivo para cada pessoa.</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-brand-600">{completedIds.size}</span>
          <span className="text-slate-400 font-medium">/{assignments.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {assignments.map((assignment) => {
          const isCompleted = completedIds.has(assignment.giver.id);
          
          return (
            <button
              key={assignment.giver.id}
              onClick={() => handleCardClick(assignment)}
              disabled={isCompleted}
              className={`
                relative h-40 md:h-48 rounded-2xl border-2 flex flex-col items-center justify-center p-4 transition-all duration-300
                ${isCompleted 
                  ? 'bg-slate-100 border-slate-200 cursor-default opacity-60 grayscale' 
                  : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100 hover:-translate-y-1 cursor-pointer'
                }
              `}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-8 h-8 text-slate-400 mb-3" />
                  <span className="font-medium text-slate-400 line-through">{assignment.giver.name}</span>
                  <span className="text-xs text-slate-400 mt-1">Pronto</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                    <Lock className="w-6 h-6 text-brand-500" />
                  </div>
                  <span className="font-bold text-slate-800 text-lg truncate w-full px-2">{assignment.giver.name}</span>
                  <span className="text-xs text-brand-600 font-medium mt-1">Toque para revelar</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {allCompleted && (
        <div className="text-center animate-fade-in pb-10">
          <p className="text-slate-600 mb-6">Todos os pares foram sorteados! Bom evento.</p>
          <Button variant="outline" onClick={onReset} icon={<RotateCcw className="w-4 h-4"/>}>
            Novo Sorteio
          </Button>
        </div>
      )}

      {/* Modal Overlay */}
      {activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-scale-in transform transition-all">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 text-center">
              <h3 className="text-slate-400 text-sm uppercase tracking-wider font-medium mb-1">Participante Atual</h3>
              <h2 className="text-3xl font-bold text-white">{activeAssignment.giver.name}</h2>
            </div>

            {/* Modal Body */}
            <div className="p-8 flex flex-col items-center justify-center min-h-[280px]">
              {!isRevealed ? (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                    <EyeOff className="w-10 h-10 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-800 font-medium text-lg mb-2">Você é {activeAssignment.giver.name}?</p>
                    <p className="text-slate-500 text-sm">Por favor, garanta que ninguém mais esteja olhando para a tela.</p>
                  </div>
                  <Button fullWidth onClick={handleConfirmReveal} className="mt-4">
                    Sim, Revelar Meu Par
                  </Button>
                </div>
              ) : (
                <div className="text-center w-full animate-slide-up">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-2">Seu amigo secreto é</p>
                    <div className="text-3xl font-extrabold text-brand-600 bg-brand-50 py-3 rounded-xl border border-brand-100">
                      {activeAssignment.receiver.name}
                    </div>
                  </div>

                  {/* Sharing Section */}
                  <div className="mb-6 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400 mb-3">Enviar resultado para {activeAssignment.giver.name}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={handleWhatsApp}
                        className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128c7e] text-white py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                      </button>
                      <button 
                        onClick={handleSMS}
                        className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>SMS</span>
                      </button>
                    </div>
                     {canNativeShare && (
                      <button 
                        onClick={handleNativeShare}
                        className="w-full mt-2 flex items-center justify-center gap-2 text-brand-600 hover:bg-brand-50 py-2 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                        Mais opções de partilha
                      </button>
                    )}
                  </div>

                  <Button fullWidth onClick={handleCloseModal} variant="outline">
                    Fechar e Esconder
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};