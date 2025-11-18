import React from "react";
import { useRouter } from "next/router";
import { ArrowUp, MessageCircle, Clock } from "lucide-react";

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
  commentCount?: number;
}

interface DiscussionListProps {
  discussions: Discussion[];
  projectId: string;
}

export default function DiscussionList({ discussions, projectId }: DiscussionListProps) {
  const router = useRouter();

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

  if (discussions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No discussions yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Be the first to start a discussion!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {discussions.map((discussion) => (
        <div
          key={discussion.id}
          onClick={() => router.push(`/projects/${projectId}/discussions/${discussion.id}`)}
          className="bg-white rounded-lg shadow hover:shadow-md transition-all p-5 cursor-pointer border border-gray-100 hover:border-indigo-200"
        >
          <div className="flex items-start gap-4">
            {/* Upvote section */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement upvote
                }}
                className="flex flex-col items-center gap-1 p-1 rounded hover:bg-gray-100"
              >
                <ArrowUp className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{discussion.upvotes}</span>
              </button>
            </div>

            {/* Discussion content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                {discussion.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {discussion.content}
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  {discussion.author.avatar && (
                    <img
                      src={discussion.author.avatar}
                      alt={discussion.author.name || 'User'}
                      className="w-4 h-4 rounded-full"
                    />
                  )}
                  <span>{discussion.author.name || 'Anonymous'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeAgo(discussion.createdAt)}</span>
                </div>

                {discussion.commentCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{discussion.commentCount} {discussion.commentCount === 1 ? 'comment' : 'comments'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
