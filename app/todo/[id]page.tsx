"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTodo } from "@/hooks/useTodo";
import { useUpdateTodo } from "@/hooks/useUpdateTodo";
import { useDeleteTodo } from "@/hooks/useDeleteTodo";
import ThemeToggle from "@/components/ThemeToggle";

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const { data: todo, isLoading, error } = useTodo(id);
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  const { mutate: updateTodo, isPending: saving } = useUpdateTodo();
  const { mutate: deleteTodo } = useDeleteTodo();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setCompleted(todo.completed);
    }
  }, [todo]);

  const handleSave = () => {
    if (!todo) return;

    updateTodo(
      { id: todo.id, title, completed },
      {
        onSuccess: () => alert("Todo updated successfully!"),
        onError: () => alert("Update failed. Please try again."),
      }
    );
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this todo?")) return;

    deleteTodo(id, {
      onSuccess: () => {
        alert("Todo deleted successfully!");
        router.push("/");
      },
      onError: () => alert("Delete failed. Please try again."),
    });
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading todo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold mb-4">Failed to load todo</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <ThemeToggle />

      <section className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Edit Todo</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-lg"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-5 h-5"
              />
              <span className="text-lg">Mark as completed</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors font-semibold"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                ← Back
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {todo?.created_at && (
            <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              <p>Created: {new Date(todo.created_at).toLocaleString()}</p>
              {todo.updated_at && (
                <p>
                  Last updated: {new Date(todo.updated_at).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
