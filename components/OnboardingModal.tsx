import React from "react";
import { X, Rocket, Tag, BookOpen, Users } from "lucide-react";
import { Button } from "./ui/button";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onGetStarted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Rocket className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Innovators Hub!
          </h2>
          <p className="text-gray-600 text-lg">
            Share your first AI-powered project with the community
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Rocket className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Share Your POC
              </h3>
              <p className="text-sm text-gray-600">
                Add your vibe-coded proof of concept and show what you've built
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Tag AI Tools
              </h3>
              <p className="text-sm text-gray-600">
                Show which AI coding assistants helped bring your project to life
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Share Journey Posts
              </h3>
              <p className="text-sm text-gray-600">
                Document your progress and learnings as you iterate on your project
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Get Support
              </h3>
              <p className="text-sm text-gray-600">
                Build a community of supporters who believe in your vision
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Skip for now
          </Button>
          <Button
            onClick={onGetStarted}
            className="px-6"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
