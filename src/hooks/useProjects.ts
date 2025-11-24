import { useState, useEffect, useCallback } from 'react';
import { Project } from '../../types';
import { Storage, STORAGE_KEYS } from '../storage/localStorage';

/**
 * Custom hook for managing projects with localStorage persistence
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects on mount
  useEffect(() => {
    const loadedProjects = Storage.load<Project[]>(STORAGE_KEYS.PROJECTS, []);
    setProjects(loadedProjects);
    setLoading(false);
  }, []);

  // Save projects whenever they change
  useEffect(() => {
    if (!loading) {
      Storage.save(STORAGE_KEYS.PROJECTS, projects);
    }
  }, [projects, loading]);

  /**
   * Create a new project
   */
  const createProject = useCallback((projectData: Omit<Project, 'id' | 'dateCreated' | 'dateModified'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dateCreated: now,
      dateModified: now,
      cardCount: 0,
      setCount: 0,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  /**
   * Update an existing project
   */
  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...updates, dateModified: new Date().toISOString() }
        : project
    ));
  }, []);

  /**
   * Delete a project
   */
  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    // TODO: Also delete all cards and sets associated with this project
  }, []);

  /**
   * Get a single project by ID
   */
  const getProject = useCallback((id: string): Project | undefined => {
    return projects.find(project => project.id === id);
  }, [projects]);

  /**
   * Duplicate a project
   */
  const duplicateProject = useCallback((id: string) => {
    const original = getProject(id);
    if (!original) return null;

    const now = new Date().toISOString();
    const duplicate: Project = {
      ...original,
      id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${original.name} (Copy)`,
      dateCreated: now,
      dateModified: now,
    };
    setProjects(prev => [...prev, duplicate]);
    return duplicate;
  }, [getProject]);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    duplicateProject,
  };
}
