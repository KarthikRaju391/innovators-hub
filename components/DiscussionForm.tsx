import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";

interface DiscussionFormProps {
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DiscussionForm({ projectId, onSuccess, onCancel }: DiscussionFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create discussion");
      }

      setFormData({ title: "", content: "" });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreview = (markdown: string) => {
    return markdown
      .split('\n')
      .map((line) => {
        if (line.startsWith('### ')) return `<h3 class="text-lg font-semibold mt-4 mb-2">${line.substring(4)}</h3>`;
        if (line.startsWith('## ')) return `<h2 class="text-xl font-semibold mt-4 mb-2">${line.substring(3)}</h2>`;
        if (line.startsWith('# ')) return `<h1 class="text-2xl font-bold mt-4 mb-2">${line.substring(2)}</h1>`;

        let processed = line;
        processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');
        processed = processed.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');

        if (line === '') return '<br />';
        return `<p class="mb-2">${processed}</p>`;
      })
      .join('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Start a Discussion</h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!showPreview ? (
        <>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's this discussion about?"
              required
              maxLength={200}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Provide more details... Markdown supported!"
              required
              rows={8}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.content.length} characters
            </p>
          </div>
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 min-h-[200px] bg-gray-50">
          <h4 className="text-xl font-bold mb-3">{formData.title || "Discussion Title"}</h4>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(formData.content) }}
          />
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Start Discussion
        </Button>
      </div>
    </form>
  );
}
