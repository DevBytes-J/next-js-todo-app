"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateTodo } from "@/hooks/useCreateTodo";
import ThemeToggle from "@/components/ThemeToggle";

export default function NewTodoPage() {
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const router = useRouter();

  const { mutate: createTodo, isPending } = useCreateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTodo = {
      title,
      completed,
      userId: 1,
    };

    createTodo(newTodo, {
      onSuccess: (data) => {
        alert(`Todo created with id ${data.id}`);
        router.push("/");
      },
      onError: () => {
        alert("Creation failed.");
      },
    });
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <ThemeToggle />

      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Create New Todo</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg space-y-6"
        >
          <div>
            <label className="block text-sm font-semibold mb-2">Title:</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              placeholder="Enter todo title..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Status:</label>
            <select
              value={completed.toString()}
              onChange={(e) => setCompleted(e.target.value === "true")}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            >
              <option value="false">Incomplete</option>
              <option value="true">Completed</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors font-semibold"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
