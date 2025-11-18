import React from "react";
import { Badge } from "./ui/badge";
import { Calendar, Lock, Globe, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface JourneyPost {
  id: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface JourneyPostListProps {
  posts: JourneyPost[];
  isCreator?: boolean;
  onEdit?: (post: JourneyPost) => void;
  onDelete?: (postId: string) => void;
}

export default function JourneyPostList({
  posts,
  isCreator = false,
  onEdit,
  onDelete,
}: JourneyPostListProps) {
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No journey posts yet.</p>
        {isCreator && (
          <p className="text-sm text-gray-400 mt-2">
            Share your building journey with your audience
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {post.isPublic ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <Globe className="w-3 h-3 mr-1" />
                  Public
                </Badge>
              ) : (
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  <Lock className="w-3 h-3 mr-1" />
                  Supporters Only
                </Badge>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>

            {isCreator && onEdit && onDelete && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(post)}
                  className="h-8"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this journey post?")) {
                      onDelete(post.id);
                    }
                  }}
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>

          {post.updatedAt !== post.createdAt && (
            <p className="text-xs text-gray-400 mt-3">
              Updated {new Date(post.updatedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
