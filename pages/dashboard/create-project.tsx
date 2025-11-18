import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import ProjectForm from "../../components/ProjectForm";
import ProjectSuccessModal from "../../components/ProjectSuccessModal";

function CreateProject() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdProject, setCreatedProject] = useState<{ id: string; title: string } | null>(null);

  // Override the ProjectForm's default redirect behavior
  React.useEffect(() => {
    const handleProjectCreated = (event: CustomEvent) => {
      setCreatedProject({ id: event.detail.id, title: event.detail.title });
      setShowSuccessModal(true);
    };

    window.addEventListener('projectCreated' as any, handleProjectCreated as EventListener);

    return () => {
      window.removeEventListener('projectCreated' as any, handleProjectCreated as EventListener);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block font-medium"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
          <p className="text-gray-600">
            Share your AI-powered project with the community and start building in public
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-8">
          <ProjectForm />
        </div>
      </div>

      {createdProject && (
        <ProjectSuccessModal
          isOpen={showSuccessModal}
          projectId={createdProject.id}
          projectTitle={createdProject.title}
          onClose={() => {
            setShowSuccessModal(false);
            router.push(`/dashboard/${createdProject.id}`);
          }}
        />
      )}
    </div>
  );
}

export default CreateProject;