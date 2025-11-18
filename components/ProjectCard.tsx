import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { ArrowUp, MessageSquare, Users, ExternalLink, Github } from "lucide-react";
import AIToolBadge from "./AIToolBadge";

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
  supportersCount?: number;
  discussionsCount?: number;
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const router = useRouter();
  const [upvotes, setUpvotes] = useState(project.upvotes);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleClick = () => {
    router.push(`/projects/${project.id}`);
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  };

  const handleTechClick = (e: React.MouseEvent, tech: string) => {
    e.stopPropagation();
    router.push(`/?tech=${encodeURIComponent(tech)}`);
  };

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/creators/${project.creator.id}`);
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isUpvoting) return;

    setIsUpvoting(true);

    try {
      const response = await fetch(`/api/projects/${project.id}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || 'Failed to upvote');
        return;
      }

      const data = await response.json();
      setUpvotes(data.upvotes);
    } catch (error) {
      console.error('Error upvoting:', error);
      alert('An error occurred while upvoting');
    } finally {
      setIsUpvoting(false);
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg overflow-hidden cursor-pointer
        border border-gray-200
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
        ${featured ? 'shadow-lg' : 'shadow-md'}
        h-full flex flex-col
      `}
      onClick={handleClick}
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* AI Tool Tags - Prominent at top */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.aiToolTags.slice(0, 3).map((tag) => (
            <AIToolBadge
              key={tag}
              tool={tag}
              onClick={(e) => handleTagClick(e, tag)}
              size="md"
            />
          ))}
          {project.aiToolTags.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
              +{project.aiToolTags.length - 3}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold text-gray-900 mb-3 line-clamp-2 ${featured ? 'text-2xl' : 'text-xl'}`}>
          {project.title}
        </h3>

        {/* Description */}
        <p className={`text-gray-600 mb-4 flex-1 ${featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              onClick={(e) => handleTechClick(e, tech)}
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
            <span className="text-xs text-gray-500 px-2 py-1">
              +{project.techStack.length - 4}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100">
          {/* Creator Info */}
          <div
            className="flex items-center mb-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleCreatorClick}
          >
            {project.creator.avatar ? (
              <img
                src={project.creator.avatar}
                alt={project.creator.name || 'Creator'}
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold mr-2">
                {(project.creator.name || 'A')[0].toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors">
              {project.creator.name || 'Anonymous'}
            </span>
          </div>

          {/* Stats and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button
                onClick={handleUpvote}
                disabled={isUpvoting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUp className="w-4 h-4" />
                <span className="font-medium">{upvotes}</span>
              </button>

              {project.supportersCount !== undefined && project.supportersCount > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{project.supportersCount}</span>
                </div>
              )}

              {project.discussionsCount !== undefined && project.discussionsCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{project.discussionsCount}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="View Repository"
              >
                <Github className="w-4 h-4" />
              </a>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="Live Demo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;