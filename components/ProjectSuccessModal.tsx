import React from "react";
import { CheckCircle, ExternalLink, BookOpen, FileText, Share2 } from "lucide-react";
import { Button } from "./ui/button";

interface ProjectSuccessModalProps {
  isOpen: boolean;
  projectId: string;
  projectTitle: string;
  onClose: () => void;
}

const ProjectSuccessModal: React.FC<ProjectSuccessModalProps> = ({
  isOpen,
  projectId,
  projectTitle,
  onClose,
}) => {
  if (!isOpen) return null;

  const projectUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/projects/${projectId}`;

  const handleShare = () => {
    const tweetText = `Just shared my project "${projectTitle}" on Innovators Hub! 🚀\n\nCheck it out: ${projectUrl}\n\n#VibeCode #AI #BuildInPublic`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-8">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Project Published!
          </h2>
          <p className="text-gray-600">
            Your project is now live and visible to the community
          </p>
        </div>

        {/* Project Link */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 mb-1">Project URL</p>
              <p className="text-sm font-mono text-gray-900 truncate">
                {projectUrl}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Next steps:</p>

          <a
            href={`/projects/${projectId}`}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
          >
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <ExternalLink className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">View Project</p>
              <p className="text-xs text-gray-600">See your public project page</p>
            </div>
          </a>

          <a
            href={`/dashboard/${projectId}?action=add-version`}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">Add First Version</p>
              <p className="text-xs text-gray-600">Document your first release</p>
            </div>
          </a>

          <a
            href={`/dashboard/${projectId}?action=add-journey-post`}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">Write Journey Post</p>
              <p className="text-xs text-gray-600">Share your building experience</p>
            </div>
          </a>

          <button
            onClick={handleShare}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Share2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-900 text-sm">Share on Twitter</p>
              <p className="text-xs text-gray-600">Let your network know!</p>
            </div>
          </button>
        </div>

        {/* Close Button */}
        <Button
          onClick={onClose}
          className="w-full"
          variant="outline"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default ProjectSuccessModal;
