import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import VersionForm from "../../components/VersionForm";
import VersionList from "../../components/VersionList";
import JourneyPostForm from "../../components/JourneyPostForm";
import JourneyPostList from "../../components/JourneyPostList";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";

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
}

interface Version {
  id: string;
  versionNumber: string;
  releaseNotes?: string;
  isPublic: boolean;
  releasedAt: string;
}

interface Supporter {
  id: string;
  tier: string;
  startDate: string;
  amountPaid?: number;
  isActive: boolean;
  supporter: {
    id: string;
    name?: string;
    email: string;
    avatar?: string;
  };
}

interface JourneyPost {
  id: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

function ProjectDashboard() {
  const router = useRouter();
  const { projectId } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [versions, setVersions] = useState<Version[]>([]);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [journeyPosts, setJourneyPosts] = useState<JourneyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'supporters' | 'journey'>('overview');
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [showJourneyForm, setShowJourneyForm] = useState(false);
  const [editingJourneyPost, setEditingJourneyPost] = useState<JourneyPost | null>(null);

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

        // Fetch versions
        const versionsRes = await fetch(`/api/projects/${projectId}/versions`);
        const versionsData = await versionsRes.json();
        setVersions(versionsData);

        // Fetch supporters
        const supportersRes = await fetch(`/api/projects/${projectId}/supporters`);
        const supportersData = await supportersRes.json();
        setSupporters(supportersData);

        // Fetch journey posts
        const journeyRes = await fetch(`/api/projects/${projectId}/journey`);
        const journeyData = await journeyRes.json();
        setJourneyPosts(journeyData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const refreshVersions = async () => {
    if (!projectId || typeof projectId !== 'string') return;

    try {
      const versionsRes = await fetch(`/api/projects/${projectId}/versions`);
      const versionsData = await versionsRes.json();
      setVersions(versionsData);
      setShowVersionForm(false);
    } catch (err) {
      console.error('Error refreshing versions:', err);
    }
  };

  const refreshJourneyPosts = async () => {
    if (!projectId || typeof projectId !== 'string') return;

    try {
      const journeyRes = await fetch(`/api/projects/${projectId}/journey`);
      const journeyData = await journeyRes.json();
      setJourneyPosts(journeyData);
      setShowJourneyForm(false);
      setEditingJourneyPost(null);
    } catch (err) {
      console.error('Error refreshing journey posts:', err);
    }
  };

  const handleDeleteJourneyPost = async (postId: string) => {
    if (!projectId || typeof projectId !== 'string') return;

    try {
      const response = await fetch(`/api/projects/${projectId}/journey/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete journey post');
      }

      refreshJourneyPosts();
    } catch (err) {
      console.error('Error deleting journey post:', err);
      alert('Failed to delete journey post');
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
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="mt-2 text-gray-600">{project.description}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'versions', label: 'Versions' },
              { id: 'supporters', label: 'Supporters' },
              { id: 'journey', label: 'Journey' },
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
              <div className="space-y-2">
                <p><strong>Repository:</strong> <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">{project.repoUrl}</a></p>
                {project.demoUrl && <p><strong>Demo:</strong> <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">{project.demoUrl}</a></p>}
                <p><strong>Upvotes:</strong> {project.upvotes}</p>
                <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tech Stack & Tools</h3>
              <div className="mb-4">
                <h4 className="font-medium text-gray-700">AI Tools:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.aiToolTags.map((tag) => (
                    <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Tech Stack:</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {project.techStack.map((tech) => (
                    <span key={tech} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Version Management</h2>
              {!showVersionForm && (
                <Button
                  onClick={() => setShowVersionForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Version
                </Button>
              )}
            </div>

            {showVersionForm && projectId && typeof projectId === 'string' && (
              <VersionForm
                projectId={projectId}
                onSuccess={refreshVersions}
                onCancel={() => setShowVersionForm(false)}
              />
            )}

            <VersionList versions={versions} />
          </div>
        )}

        {activeTab === 'supporters' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Supporters ({supporters.length})</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {supporters.length === 0 ? (
                <p className="p-6 text-gray-500">No supporters yet.</p>
              ) : (
                supporters.map((supporter) => (
                  <div key={supporter.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {supporter.supporter.avatar && (
                          <img
                            src={supporter.supporter.avatar}
                            alt={supporter.supporter.name || 'Supporter'}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {supporter.supporter.name || supporter.supporter.email}
                          </p>
                          <p className="text-sm text-gray-500">{supporter.supporter.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          supporter.tier === 'champion' ? 'bg-purple-100 text-purple-800' :
                          supporter.tier === 'early-access' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {supporter.tier}
                        </span>
                        {supporter.amountPaid && (
                          <p className="text-xs text-gray-500 mt-1">${supporter.amountPaid / 100}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'journey' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Journey Posts</h2>
              {!showJourneyForm && !editingJourneyPost && (
                <Button
                  onClick={() => setShowJourneyForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Journey Post
                </Button>
              )}
            </div>

            {(showJourneyForm || editingJourneyPost) && projectId && typeof projectId === 'string' && (
              <JourneyPostForm
                projectId={projectId}
                initialData={editingJourneyPost ? {
                  id: editingJourneyPost.id,
                  content: editingJourneyPost.content,
                  isPublic: editingJourneyPost.isPublic,
                } : undefined}
                onSuccess={refreshJourneyPosts}
                onCancel={() => {
                  setShowJourneyForm(false);
                  setEditingJourneyPost(null);
                }}
              />
            )}

            <JourneyPostList
              posts={journeyPosts}
              isCreator={true}
              onEdit={(post) => setEditingJourneyPost(post)}
              onDelete={handleDeleteJourneyPost}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDashboard;