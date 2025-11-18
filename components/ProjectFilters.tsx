import * as React from "react";
import { useState } from "react";

interface ProjectFiltersProps {
  onFiltersChange: (filters: {
    tag?: string;
    tech?: string;
    sort: string;
    searchQuery?: string;
  }) => void;
  initialFilters?: {
    tag?: string;
    tech?: string;
    sort: string;
    searchQuery?: string;
  };
}

const AI_TOOL_TAGS = [
  'Claude Code',
  'Cursor',
  'GitHub Copilot',
  'ChatGPT',
  'Codex',
  'Windsurf',
  'Replit Agent',
  'Codeium',
  'Tabnine',
  'Amazon CodeWhisperer',
];

const TECH_STACK = [
  'Next.js',
  'React',
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'Node.js',
  'PostgreSQL',
  'MongoDB',
  'MySQL',
  'Redis',
  'GraphQL',
  'REST API',
  'Tailwind CSS',
  'Vue.js',
  'Angular',
  'Django',
  'Flask',
  'FastAPI',
  'Express',
  'NestJS',
  'Docker',
  'Kubernetes',
  'AWS',
  'Vercel',
  'Supabase',
  'Firebase',
];

const SORT_OPTIONS = [
  { value: 'new', label: 'Newest' },
  { value: 'trending', label: 'Trending' },
  { value: 'supporters', label: 'Most Supported' }
];

function ProjectFilters({ onFiltersChange, initialFilters }: ProjectFiltersProps) {
  const [tag, setTag] = useState<string>('');
  const [tech, setTech] = useState<string>('');
  const [sort, setSort] = useState<string>('new');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Initialize from props
  React.useEffect(() => {
    if (initialFilters) {
      setTag(initialFilters.tag || '');
      setTech(initialFilters.tech || '');
      setSort(initialFilters.sort || 'new');
      setSearchQuery(initialFilters.searchQuery || '');
    }
  }, [initialFilters?.tag, initialFilters?.tech, initialFilters?.sort, initialFilters?.searchQuery]);

  const handleChange = () => {
    onFiltersChange({
      tag: tag || undefined,
      tech: tech || undefined,
      sort,
      searchQuery: searchQuery || undefined,
    });
  };

  React.useEffect(() => {
    handleChange();
  }, [tag, tech, sort, searchQuery]);

  const clearFilters = () => {
    setTag('');
    setTech('');
    setSort('new');
    setSearchQuery('');
  };

  const activeFilterCount = [tag, tech, searchQuery].filter(Boolean).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Filter Projects
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {activeFilterCount} active
            </span>
          )}
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Projects
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
            AI Tool
          </label>
          <select
            id="tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Tools</option>
            {AI_TOOL_TAGS.map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tech" className="block text-sm font-medium text-gray-700 mb-1">
            Tech Stack
          </label>
          <select
            id="tech"
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Tech</option>
            {TECH_STACK.map((techItem) => (
              <option key={techItem} value={techItem}>
                {techItem}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default ProjectFilters;