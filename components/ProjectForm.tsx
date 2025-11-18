import React, { useState } from "react";
import { useRouter } from "next/router";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { MultiSelect } from "../components/ui/multi-select";
import { Loader2 } from "lucide-react";

// AI Tool options
const AI_TOOLS = [
  "Claude Code",
  "Cursor",
  "GitHub Copilot",
  "ChatGPT",
  "Codex",
  "Windsurf",
  "Replit Agent",
  "Codeium",
  "Tabnine",
  "Amazon CodeWhisperer",
];

// Tech Stack options
const TECH_STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "JavaScript",
  "Python",
  "Go",
  "Rust",
  "Node.js",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Redis",
  "GraphQL",
  "REST API",
  "Tailwind CSS",
  "Vue.js",
  "Angular",
  "Django",
  "Flask",
  "FastAPI",
  "Express",
  "NestJS",
  "Docker",
  "Kubernetes",
  "AWS",
  "Vercel",
  "Supabase",
  "Firebase",
];

interface ProjectFormProps {
  edit?: boolean;
  data?: {
    id?: string;
    title?: string;
    description?: string;
    demoUrl?: string;
    repoUrl?: string;
    techStack?: string[];
    aiToolTags?: string[];
  };
}

const ProjectForm = ({ edit = false, data = {} }: ProjectFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: data.title || "",
    description: data.description || "",
    demoUrl: data.demoUrl || "",
    repoUrl: data.repoUrl || "",
    techStack: (data.techStack as string[]) || [],
    aiToolTags: (data.aiToolTags as string[]) || [],
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let res;
      if (edit && data.id) {
        res = await fetch(`/api/projects/${data.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Failed to save project");
        return;
      }

      const result = await res.json();

      // Emit event for parent component (if listening)
      if (typeof window !== 'undefined' && !edit) {
        const event = new CustomEvent('projectCreated', {
          detail: { id: result.id, title: formData.title }
        });
        window.dispatchEvent(event);
      }

      // Redirect to the project detail page after creation (fallback)
      if (!edit) {
        // Give time for event listeners to catch the event
        setTimeout(() => {
          router.push(`/dashboard/${result.id}`);
        }, 100);
      } else {
        router.push(`/dashboard/${result.id}`);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert("An error occurred while saving the project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 max-w-2xl mx-auto w-full"
    >
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-semibold">
          Project Title <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g., AI-Powered Task Manager"
          required
          autoFocus
        />
        <p className="text-xs text-muted-foreground">
          Give your project a catchy name that captures what it does
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-semibold">
          Project Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Describe your project, what it does, and what problem it solves..."
          required
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          Explain what you built and why it's cool (supports markdown)
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="repoUrl" className="text-sm font-semibold">
          Repository URL <span className="text-red-500">*</span>
        </label>
        <Input
          type="url"
          name="repoUrl"
          id="repoUrl"
          value={formData.repoUrl}
          onChange={(e) => updateField("repoUrl", e.target.value)}
          placeholder="https://github.com/username/repo"
          required
        />
        <p className="text-xs text-muted-foreground">
          GitHub/GitLab repository link (required for verification)
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="demoUrl" className="text-sm font-semibold">
          Demo URL (Optional)
        </label>
        <Input
          type="url"
          name="demoUrl"
          id="demoUrl"
          value={formData.demoUrl}
          onChange={(e) => updateField("demoUrl", e.target.value)}
          placeholder="https://your-project.com"
        />
        <p className="text-xs text-muted-foreground">
          Link to live demo or video walkthrough (optional)
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="aiToolTags" className="text-sm font-semibold">
          AI Tools Used <span className="text-red-500">*</span>
        </label>
        <MultiSelect
          options={AI_TOOLS}
          selected={formData.aiToolTags}
          onChange={(selected) => updateField("aiToolTags", selected)}
          placeholder="Select AI tools used in this project..."
        />
        <p className="text-xs text-muted-foreground">
          Which AI coding tools did you use? (Select all that apply)
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="techStack" className="text-sm font-semibold">
          Tech Stack <span className="text-red-500">*</span>
        </label>
        <MultiSelect
          options={TECH_STACK}
          selected={formData.techStack}
          onChange={(selected) => updateField("techStack", selected)}
          placeholder="Select technologies used..."
        />
        <p className="text-xs text-muted-foreground">
          Main technologies and frameworks powering your project
        </p>
      </div>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {edit ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
