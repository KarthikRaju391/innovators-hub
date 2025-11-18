import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";

interface JourneyPostFormProps {
  projectId: string;
  initialData?: {
    id: string;
    content: string;
    isPublic: boolean;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

export default function JourneyPostForm({
  projectId,
  initialData,
  onSuccess,
  onCancel,
}: JourneyPostFormProps) {
  const [formData, setFormData] = useState({
    content: initialData?.content || "",
    isPublic: initialData?.isPublic ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/projects/${projectId}/journey/${initialData.id}`
        : `/api/projects/${projectId}/journey`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save journey post");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple markdown preview (basic implementation)
  const renderPreview = (markdown: string) => {
    return markdown
      .split('\n')
      .map((line) => {
        // Headers
        if (line.startsWith('### ')) return `<h3 class="text-lg font-semibold mt-4 mb-2">${line.substring(4)}</h3>`;
        if (line.startsWith('## ')) return `<h2 class="text-xl font-semibold mt-4 mb-2">${line.substring(3)}</h2>`;
        if (line.startsWith('# ')) return `<h1 class="text-2xl font-bold mt-4 mb-2">${line.substring(2)}</h1>`;

        // Bold and italic
        let processed = line;
        processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // Links
        processed = processed.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');

        // Line breaks
        if (line === '') return '<br />';

        return `<p class="mb-2">${processed}</p>`;
      })
      .join('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditing ? "Edit Journey Post" : "New Journey Post"}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!showPreview ? (
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Share your journey... Markdown supported!

**Examples:**
# Heading 1
## Heading 2
**Bold text**
*Italic text*
[Link text](https://example.com)"
            required
            rows={12}
            className="font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.content.length} characters • Markdown supported
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 min-h-[300px] bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(formData.content) }}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={formData.isPublic}
          onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
          Make this post public
        </label>
      </div>

      {!formData.isPublic && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded text-sm">
          <p className="font-medium">Supporters-only post</p>
          <p className="mt-1">Only your supporters will be able to read this journey post.</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.content.trim()}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Post" : "Publish Post"}
        </Button>
      </div>
    </form>
  );
}
