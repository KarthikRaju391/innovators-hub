import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";

interface VersionFormProps {
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VersionForm({ projectId, onSuccess, onCancel }: VersionFormProps) {
  const [formData, setFormData] = useState({
    versionNumber: "",
    releaseNotes: "",
    isPublic: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/versions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create version");
      }

      // Reset form
      setFormData({
        versionNumber: "",
        releaseNotes: "",
        isPublic: true,
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900">Add New Version</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="versionNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Version Number <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          id="versionNumber"
          value={formData.versionNumber}
          onChange={(e) => setFormData({ ...formData, versionNumber: e.target.value })}
          placeholder="e.g., v1.0, v2.1.0, Beta 1"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Use semantic versioning or any naming convention
        </p>
      </div>

      <div>
        <label htmlFor="releaseNotes" className="block text-sm font-medium text-gray-700 mb-1">
          Release Notes
        </label>
        <Textarea
          id="releaseNotes"
          value={formData.releaseNotes}
          onChange={(e) => setFormData({ ...formData, releaseNotes: e.target.value })}
          placeholder="What's new in this version? Markdown supported..."
          rows={6}
        />
        <p className="text-xs text-gray-500 mt-1">
          Describe new features, improvements, and bug fixes
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
          Make this version public immediately
        </label>
      </div>

      {!formData.isPublic && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded text-sm">
          <p className="font-medium">Supporters-only version</p>
          <p className="mt-1">Only your supporters will be able to access this version. You can make it public later.</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Version
        </Button>
      </div>
    </form>
  );
}
