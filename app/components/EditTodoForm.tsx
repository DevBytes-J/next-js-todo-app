"use client";

import { useState } from "react";
import { useUpdateTodo } from "@/hooks/useUpdateTodo";
import { Todo } from "@/types/todo";

interface EditTodoFormProps {
  todo: Todo;
  onUpdate: (todo: Todo) => void;
  onCancel: () => void;
}

export default function EditTodoForm({
  todo,
  onUpdate,
  onCancel,
}: EditTodoFormProps) {
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);

  const { mutate: updateTodo, isPending } = useUpdateTodo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTodo = {
      id: todo.id,
      title,
      completed,
    };
    updateTodo(updatedTodo, {
      onSuccess: (data) => {
        onUpdate(data);
        onCancel();
      },
      onError: () => {
        alert("Failed to update todo.");
      },
    });
  };

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
      />
      <select
        value={completed.toString()}
        onChange={(e) => setCompleted(e.target.value === "true")}
        className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
      >
        <option value="false">Incomplete</option>
        <option value="true">Completed</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
