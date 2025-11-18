import React from "react";
import { Badge } from "./ui/badge";
import { Calendar, Lock, Globe } from "lucide-react";

interface Version {
  id: string;
  versionNumber: string;
  releaseNotes?: string;
  isPublic: boolean;
  releasedAt: string;
}

interface VersionListProps {
  versions: Version[];
}

export default function VersionList({ versions }: VersionListProps) {
  const calculateDaysUntilPublic = (releasedAt: string) => {
    const releaseDate = new Date(releasedAt);
    const publicDate = new Date(releaseDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days later
    const now = new Date();
    const daysLeft = Math.ceil((publicDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  if (versions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">No versions released yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Create your first version to track your project's progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((version) => {
        const daysUntilPublic = !version.isPublic ? calculateDaysUntilPublic(version.releasedAt) : 0;

        return (
          <div
            key={version.id}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold text-gray-900">
                  {version.versionNumber}
                </h3>
                {version.isPublic ? (
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
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(version.releasedAt).toLocaleDateString()}
              </div>
            </div>

            {!version.isPublic && daysUntilPublic > 0 && (
              <div className="mb-3 text-sm text-yellow-700 bg-yellow-50 px-3 py-2 rounded">
                Goes public in {daysUntilPublic} day{daysUntilPublic !== 1 ? 's' : ''}
              </div>
            )}

            {!version.isPublic && daysUntilPublic === 0 && (
              <div className="mb-3 text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded">
                Ready to be made public
              </div>
            )}

            {version.releaseNotes && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{version.releaseNotes}</p>
              </div>
            )}

            {!version.releaseNotes && (
              <p className="text-gray-400 text-sm italic">No release notes provided</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
