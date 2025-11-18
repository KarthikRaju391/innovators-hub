import React, { useState } from "react";
import CommentForm from "./CommentForm";
import { ArrowUp, MessageCircle, Clock } from "lucide-react";

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

interface CommentSectionProps {
  discussionId: string;
  comments: Comment[];
  onRefresh: () => void;
}

export default function CommentSection({
  discussionId,
  comments,
  onRefresh,
}: CommentSectionProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

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

  const handleUpvote = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/upvote`, {
        method: "POST",
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error upvoting comment:", error);
    }
  };

  // Separate top-level comments and replies
  const topLevelComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const replies = getReplies(comment.id);

    return (
      <div className={`${isReply ? 'ml-8 mt-3' : ''}`}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name || 'User'}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                {(comment.author.name || 'A')[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Comment content */}
          <div className="flex-1 min-w-0">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm text-gray-900">
                  {comment.author.name || 'Anonymous'}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {getTimeAgo(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => handleUpvote(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowUp className="w-3 h-3" />
                <span>{comment.upvotes}</span>
              </button>

              {!isReply && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              )}
            </div>

            {/* Reply form */}
            {replyingTo === comment.id && (
              <div className="mt-3">
                <CommentForm
                  discussionId={discussionId}
                  parentId={comment.id}
                  onSuccess={() => {
                    setReplyingTo(null);
                    onRefresh();
                  }}
                  onCancel={() => setReplyingTo(null)}
                  placeholder="Write a reply..."
                />
              </div>
            )}

            {/* Replies */}
            {replies.length > 0 && (
              <div className="mt-3 space-y-3">
                {replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add comment form */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        <CommentForm discussionId={discussionId} onSuccess={onRefresh} />
      </div>

      {/* Comments list */}
      {topLevelComments.length > 0 ? (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          {topLevelComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MessageCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}
