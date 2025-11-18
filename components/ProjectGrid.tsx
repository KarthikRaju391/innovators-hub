import * as React from "react";
import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  description: string;
  demoUrl?: string;
  repoUrl: string;
  techStack: string[];
  aiToolTags: string[];
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name?: string;
    avatar?: string;
  };
}

interface ProjectGridProps {
  tag?: string;
  tech?: string;
  sort?: string;
  searchQuery?: string;
}

function ProjectGrid({ tag, tech, sort = 'new', searchQuery }: ProjectGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = '/api/projects';
        const params = new URLSearchParams();

        // If there's a search query, use the search endpoint
        if (searchQuery) {
          url = '/api/projects/search';
          params.append('q', searchQuery);
        }

        // Add filter parameters
        if (tag) params.append('tag', tag);
        if (tech) params.append('tech', tech);
        if (sort) params.append('sort', sort);

        const queryString = params.toString();
        const response = await fetch(`${url}${queryString ? `?${queryString}` : ''}`);

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [tag, tech, sort, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    const hasFilters = tag || tech || searchQuery;

    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {hasFilters ? "No projects found with these filters" : "No projects yet"}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {hasFilters
            ? "Try adjusting your filters or be the first to create a project with these technologies!"
            : "Be the first to share your AI-powered project with the community."}
        </p>
        <button
          onClick={() => (window.location.href = "/dashboard/create-project")}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
        >
          Create First Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectGrid;