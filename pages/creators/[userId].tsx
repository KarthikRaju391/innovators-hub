import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import ProjectCard from "../../components/ProjectCard";
import { Github, Twitter, Linkedin, Globe, Calendar, FolderGit2, Users, TrendingUp } from "lucide-react";

interface Creator {
  id: string;
  name?: string;
  bio?: string;
  avatar?: string;
  github_url?: string;
  twitter_url?: string;
  website_url?: string;
  linkedin_url?: string;
  created_at: string;
  stats: {
    projectsCount: number;
    totalUpvotes: number;
    supportersCount: number;
  };
}

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

function CreatorProfile() {
  const router = useRouter();
  const { userId } = router.query;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || typeof userId !== 'string') return;

    const fetchCreatorData = async () => {
      try {
        // Fetch creator profile
        const profileResponse = await fetch(`/api/users/${userId}`);
        if (!profileResponse.ok) {
          throw new Error('Creator not found');
        }
        const profileData = await profileResponse.json();
        setCreator(profileData);

        // Fetch creator's projects
        const projectsResponse = await fetch(`/api/users/${userId}/projects`);
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-12">
          <p className="text-red-600">Error: {error || 'Creator not found'}</p>
        </div>
      </div>
    );
  }

  const socialLinks = [
    { url: creator.github_url, icon: <Github className="w-5 h-5" />, label: 'GitHub' },
    { url: creator.twitter_url, icon: <Twitter className="w-5 h-5" />, label: 'Twitter' },
    { url: creator.linkedin_url, icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn' },
    { url: creator.website_url, icon: <Globe className="w-5 h-5" />, label: 'Website' },
  ].filter(link => link.url);

  const memberSince = new Date(creator.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {creator.avatar ? (
                <img
                  src={creator.avatar}
                  alt={creator.name || 'Creator'}
                  className="w-32 h-32 rounded-full border-4 border-indigo-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-5xl font-bold border-4 border-indigo-100">
                  {(creator.name || 'A')[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {creator.name || 'Anonymous Creator'}
              </h1>

              {creator.bio && (
                <p className="text-gray-600 mb-4 leading-relaxed">{creator.bio}</p>
              )}

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      title={link.label}
                    >
                      {link.icon}
                      <span className="text-sm font-medium">{link.label}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Member Since */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Member since {memberSince}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
                <FolderGit2 className="w-5 h-5" />
                <span className="text-3xl font-bold">{creator.stats.projectsCount}</span>
              </div>
              <p className="text-sm text-gray-600">Projects</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-3xl font-bold">{creator.stats.totalUpvotes}</span>
              </div>
              <p className="text-sm text-gray-600">Total Upvotes</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-3xl font-bold">{creator.stats.supportersCount}</span>
              </div>
              <p className="text-sm text-gray-600">Supporters</p>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Projects ({projects.length})
          </h2>

          {projects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreatorProfile;
