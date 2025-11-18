import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import DiscussionForm from "../../components/DiscussionForm";
import DiscussionList from "../../components/DiscussionList";
import { ArrowUp, ExternalLink, Github, Users, Calendar } from "lucide-react";

interface Creator {
  id: string;
  name?: string;
  avatar?: string;
  bio?: string;
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
  creator: Creator;
  discussionCount: number;
}

interface Version {
  id: string;
  versionNumber: string;
  releaseNotes?: string;
  isPublic: boolean;
  releasedAt: string;
}

interface JourneyPost {
  id: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  createdAt: string;
  author: {
    id: string;
    name?: string;
    avatar?: string;
  };
}

function PublicProjectPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [journeyPosts, setJourneyPosts] = useState<JourneyPost[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'journey' | 'discussions'>('overview');
  const [supporterCount, setSupporterCount] = useState(0);
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);

  useEffect(() => {
    if (!projectId || typeof projectId !== 'string') return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch project details
        const projectRes = await fetch(`/api/projects/${projectId}`);
        if (!projectRes.ok) throw new Error('Failed to fetch project');
        const projectData = await projectRes.json();
        setProject(projectData);

        // Fetch versions (only public ones for non-supporters)
        const versionsRes = await fetch(`/api/projects/${projectId}/versions`);
        if (versionsRes.ok) {
          const versionsData = await versionsRes.json();
          setVersions(versionsData.filter((v: Version) => v.isPublic));
        }

        // Fetch journey posts (only public ones)
        const journeyRes = await fetch(`/api/projects/${projectId}/journey`);
        if (journeyRes.ok) {
          const journeyData = await journeyRes.json();
          setJourneyPosts(journeyData.filter((p: JourneyPost) => p.isPublic));
        }

        // Fetch discussions
        const discussionsRes = await fetch(`/api/projects/${projectId}/discussions`);
        if (discussionsRes.ok) {
          const discussionsData = await discussionsRes.json();
          setDiscussions(discussionsData);
        }

        // Fetch supporter count
        const supportersRes = await fetch(`/api/projects/${projectId}/supporters`);
        if (supportersRes.ok) {
          const supportersData = await supportersRes.json();
          setSupporterCount(supportersData.length);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleUpvote = async () => {
    if (!projectId || typeof projectId !== 'string') return;

    try {
      const response = await fetch(`/api/projects/${projectId}/upvote`, {
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

      // Update the local state
      if (project) {
        setProject({
          ...project,
          upvotes: data.upvotes,
        });
      }
    } catch (error) {
      console.error('Error upvoting:', error);
      alert('An error occurred while upvoting');
    }
  };

  const handleSupport = () => {
    alert('Support functionality coming soon!');
  };

  const refreshDiscussions = async () => {
    if (!projectId || typeof projectId !== 'string') return;

    try {
      const discussionsRes = await fetch(`/api/projects/${projectId}/discussions`);
      if (discussionsRes.ok) {
        const discussionsData = await discussionsRes.json();
        setDiscussions(discussionsData);
        setShowDiscussionForm(false);
      }
    } catch (err) {
      console.error('Error refreshing discussions:', err);
    }
  };

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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Project not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{project.title}</h1>

              {/* AI Tool Badges - Prominent */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.aiToolTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="cursor-pointer bg-indigo-100 text-indigo-800 hover:bg-indigo-200 px-3 py-1 text-sm"
                    onClick={() => router.push(`/?tag=${encodeURIComponent(tag)}`)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="text-lg text-gray-700 mb-4">{project.description}</p>

              {/* Creator Info */}
              <div className="flex items-center gap-3">
                {project.creator.avatar && (
                  <img
                    src={project.creator.avatar}
                    alt={project.creator.name || 'Creator'}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Created by {project.creator.name || 'Anonymous'}
                  </p>
                  {project.creator.bio && (
                    <p className="text-xs text-gray-500">{project.creator.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 ml-6">
              <Button
                onClick={handleUpvote}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowUp className="w-4 h-4" />
                <span>{project.upvotes}</span>
              </Button>
              <Button
                onClick={handleSupport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Support this project
              </Button>
            </div>
          </div>

          {/* Links & Stats */}
          <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
            >
              <Github className="w-4 h-4" />
              View Repository
            </a>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              {supporterCount} supporters
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              Created {new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Support Tiers */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Support Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">🎉 Hype</h3>
              <p className="text-sm text-green-700 mb-2">Show your support and get early updates</p>
              <p className="text-xs text-green-600">Access to public journey posts</p>
            </div>
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">⚡ Early Access</h3>
              <p className="text-sm text-blue-700 mb-2">Get early access to new versions</p>
              <p className="text-xs text-blue-600">Beta versions + exclusive updates</p>
            </div>
            <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">👑 Champion</h3>
              <p className="text-sm text-purple-700 mb-2">Maximum support and perks</p>
              <p className="text-xs text-purple-600">All perks + direct creator access</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'versions', label: `Versions (${versions.length})` },
              { id: 'journey', label: `Journey (${journeyPosts.length})` },
              { id: 'discussions', label: `Discussions (${project.discussionCount || discussions.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => router.push(`/?tech=${encodeURIComponent(tech)}`)}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Version Timeline</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {versions.length === 0 ? (
                <p className="p-6 text-gray-500">No public versions released yet.</p>
              ) : (
                versions.map((version) => (
                  <div key={version.id} className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{version.versionNumber}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(version.releasedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {version.releaseNotes && (
                      <p className="text-gray-700 whitespace-pre-wrap">{version.releaseNotes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Journey Posts</h3>
              <p className="text-sm text-gray-600 mt-1">Follow the creator's building process</p>
            </div>
            <div className="divide-y divide-gray-200">
              {journeyPosts.length === 0 ? (
                <p className="p-6 text-gray-500">No public journey posts yet.</p>
              ) : (
                journeyPosts.map((post) => (
                  <div key={post.id} className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'discussions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Discussions</h2>
              {!showDiscussionForm && (
                <Button
                  onClick={() => setShowDiscussionForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Start Discussion
                </Button>
              )}
            </div>

            {showDiscussionForm && projectId && typeof projectId === 'string' && (
              <DiscussionForm
                projectId={projectId}
                onSuccess={refreshDiscussions}
                onCancel={() => setShowDiscussionForm(false)}
              />
            )}

            {projectId && typeof projectId === 'string' && (
              <DiscussionList discussions={discussions} projectId={projectId} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicProjectPage;
