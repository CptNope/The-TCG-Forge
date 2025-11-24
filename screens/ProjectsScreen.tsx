import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: '1',
    name: 'Cosmic Wanderers - Set 1',
    details: '150 Cards • 5 Packs',
    edited: 'Edited: 2 days ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHAG-e-s6ohNSAstw8t3-o9Y6ZzU0dfQ7q7gogN4Nm236z7kQj7-VTUdwPB5eBQcxciN4vUBHPLJSsOIF5j045AatnSWkVepGgieTmAlV162bQ5mcAM-KGmXt1lnNuP5K5oYnyp8JqumXPwFzMnC_QyIUSu6ugit2XhlgAErtJdPopj87Ba5pNKLohjUC5w1fwWRUg-4cEKwjYG0CCLCCtBaVcsPBqQbnJgKNAn592NOdas3IrY6kRHqb_qrNKtmRSo0f9BUhZZKQ'
  },
  {
    id: '2',
    name: 'Aetherium Chronicles',
    details: 'Cards: 212, Packs: 8, Boxes: 2',
    edited: 'Edited: 5 days ago',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsNnX0gdY9KuuZ1-pqeb-ov2GgF8_1mjLqEy_s1MAdznEh2NUhyaOwT-cFHUYAO-sbNIZVW-VL4RZux2IN6_ikVYWndM97G14gYfEciSXgPptd6-EmXQvPTX7anl0tdOHG2sqJrKWasp7M0EyWRVxX2H3ON1ge8fnHuAaEaxfj39p2l54891Mz7GHWAJxoaOmudb1JyTvgmRLUEZx_QsD-sNBE8DSv0kk4cwcMNLOOvZyK226aWMPW3gfhsFC7lnXr2xNyf9YL4uE'
  }
];

const ProjectsScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 bg-background-light/80 dark:bg-background-dark/80 px-4 py-3 backdrop-blur-sm border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <span className="material-symbols-outlined text-primary cursor-pointer">arrow_back</span>
          <h1 className="text-xl font-bold">My Projects</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-2xl">search</span>
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-2xl">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="flex flex-col gap-4">
          {projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => navigate('/sets-grid')}
              className="flex flex-col gap-4 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 p-4 active:scale-[0.99] transition-transform cursor-pointer shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <p className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{project.name}</p>
                  <p className="text-sm font-normal text-slate-500 dark:text-slate-400">{project.details}</p>
                  <p className="text-sm font-normal text-slate-500 dark:text-slate-400">{project.edited}</p>
                </div>
                <div 
                  className="h-20 w-20 flex-shrink-0 rounded-lg bg-cover bg-center bg-no-repeat shadow-inner"
                  style={{ backgroundImage: `url('${project.image}')` }}
                />
              </div>
              <div className="flex justify-end -mb-2 -mr-2">
                 <button className="h-10 w-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10">
                  <span className="material-symbols-outlined">more_vert</span>
                 </button>
              </div>
            </div>
          ))}

          {/* New Empty State Demo */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center opacity-60">
             <div className="h-24 w-24 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-slate-400">rocket_launch</span>
             </div>
             <p className="text-sm text-slate-500">Start a new project to unleash your creativity.</p>
          </div>

        </div>
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-20">
        <button 
          onClick={() => navigate('/sets-grid')}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectsScreen;
