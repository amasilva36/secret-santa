import React from 'react';
import { Gift } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center justify-center pt-12 pb-8 px-4 text-center">
      <div className="w-14 h-14 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 mb-4 rotate-3 transform hover:rotate-6 transition-transform duration-300">
        <Gift className="w-8 h-8 text-white" strokeWidth={2.5} />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        <span className="text-brand-600">Amigo</span> <span className="text-slate-700">Secreto</span>
      </h1>
      <p className="text-slate-500 text-sm md:text-base max-w-md leading-relaxed">
        Organize seu Amigo Secreto em segundos. Sem cadastro, sem emails, apenas a magia do Natal.
      </p>
    </header>
  );
};