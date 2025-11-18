import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../../../../components/Header";
import CommentSection from "../../../../components/CommentSection";
import { Button } from "../../../../components/ui/button";
import { ArrowUp, ArrowLeft, Clock } from "lucide-react";

interface Discussion {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  createdAt: string;
  projectId: string;
  author: {
    id: string;
    name?: string;
    avatar?: string;
  };
  commentCount: number;
}

interface Comment {
  id: string;
  content: string;
  upvotes: number;
  createdAt: string;
  parentId: string | null;
  author: {
    id: string;
    name?: string;
    avatar?: string;
  };
}

export default function DiscussionDetail() {
  const router = useRouter();
  const { projectId, discussionId } = router.query;
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!discussionId || typeof discussionId !== 'string') return;

    setLoading(true);
    try {
      // Fetch discussion
      const discussionRes = await fetch(`/api/discussions/${discussionId}`);
      if (!discussionRes.ok) throw new Error('Failed to fetch discussion');
      const discussionData = await discussionRes.json();
      setDiscussion(discussionData);

      // Fetch comments
      const commentsRes = await fetch(`/api/discussions/${discussionId}/comments`);
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [discussionId]);

  const handleUpvote = async () => {
    if (!discussionId || typeof discussionId !== 'string') return;

    try {
      const response = await fetch(`/api/discussions/${discussionId}/upvote`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to upvote');
      }
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
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

  if (error || !discussion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-12">
          <p className="text-red-600">{error || 'Discussion not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push(`/projects/${discussion.projectId}`)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to project
        </button>

        {/* Discussion card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-4">
            {/* Upvote section */}
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpvote}
                className="flex flex-col h-auto py-2 px-3"
              >
                <ArrowUp className="w-5 h-5" />
                <span className="text-sm font-medium">{discussion.upvotes}</span>
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {discussion.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  {discussion.author.avatar && (
                    <img
                      src={discussion.author.avatar}
                      alt={discussion.author.name || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="font-medium">
                    {discussion.author.name || 'Anonymous'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getTimeAgo(discussion.createdAt)}</span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{discussion.content}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comments section */}
        <CommentSection
          discussionId={discussion.id}
          comments={comments}
          onRefresh={fetchData}
        />
      </div>
    </div>
  );
}
