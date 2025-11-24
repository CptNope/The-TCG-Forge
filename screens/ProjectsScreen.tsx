import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../src/hooks/useProjects';
import { useAppContext } from '../src/context/AppContext';

const ProjectsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { projects, loading, createProject, deleteProject } = useProjects();
  const { setCurrentProjectId } = useAppContext();
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDetails, setNewProjectDetails] = useState('');

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    createProject({
      name: newProjectName,
      details: newProjectDetails || 'No description',
      edited: 'Just now',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHAG-e-s6ohNSAstw8t3-o9Y6ZzU0dfQ7q7gogN4Nm236z7kQj7-VTUdwPB5eBQcxciN4vUBHPLJSsOIF5j045AatnSWkVepGgieTmAlV162bQ5mcAM-KGmXt1lnNuP5K5oYnyp8JqumXPwFzMnC_QyIUSu6ugit2XhlgAErtJdPopj87Ba5pNKLohjUC5w1fwWRUg-4cEKwjYG0CCLCCtBaVcsPBqQbnJgKNAn592NOdas3IrY6kRHqb_qrNKtmRSo0f9BUhZZKQ',
    });
    
    setNewProjectName('');
    setNewProjectDetails('');
    setShowNewProjectDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

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
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-slate-500">Loading projects...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.length === 0 ? (
              <div className="mt-16 flex flex-col items-center justify-center gap-4 text-center">
                <div className="h-24 w-24 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-slate-400">rocket_launch</span>
                </div>
                <p className="text-base font-medium text-slate-700 dark:text-slate-300">No projects yet</p>
                <p className="text-sm text-slate-500">Start a new project to unleash your creativity.</p>
                <button
                  onClick={() => setShowNewProjectDialog(true)}
                  className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
                >
                  Create Your First Project
                </button>
              </div>
            ) : (
              projects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => {
                    setCurrentProjectId(project.id);
                    navigate('/sets-grid');
                  }}
                  className="flex flex-col gap-4 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 p-4 active:scale-[0.99] transition-transform cursor-pointer shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1.5 flex-1">
                      <p className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{project.name}</p>
                      <p className="text-sm font-normal text-slate-500 dark:text-slate-400">{project.details}</p>
                      <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
                        Edited: {formatDate(project.dateModified)}
                      </p>
                      {project.cardCount !== undefined && (
                        <p className="text-xs text-slate-400">{project.cardCount} cards • {project.setCount} sets</p>
                      )}
                    </div>
                    <div 
                      className="h-20 w-20 flex-shrink-0 rounded-lg bg-cover bg-center bg-no-repeat shadow-inner bg-slate-200 dark:bg-slate-700"
                      style={{ backgroundImage: `url('${project.image}')` }}
                    />
                  </div>
                  <div className="flex justify-end -mb-2 -mr-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this project?')) {
                          deleteProject(project.id);
                        }
                      }}
                      className="h-10 w-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-20">
        <button 
          onClick={() => setShowNewProjectDialog(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>

      {/* New Project Dialog */}
      {showNewProjectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-panel-dark rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g., Fantasy Realms TCG"
                  className="w-full rounded-lg bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 text-base focus:border-primary focus:ring-primary outline-none transition-all"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Description (Optional)
                </label>
                <textarea
                  value={newProjectDetails}
                  onChange={(e) => setNewProjectDetails(e.target.value)}
                  placeholder="Brief description of your card game..."
                  rows={3}
                  className="w-full rounded-lg bg-slate-100 dark:bg-white/5 border border-black/10 dark:border-white/10 p-3 text-base focus:border-primary focus:ring-primary outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNewProjectDialog(false);
                  setNewProjectName('');
                  setNewProjectDetails('');
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-black/10 dark:border-white/10 font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsScreen;
