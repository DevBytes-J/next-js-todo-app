"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTodos, updateTodo, deleteTodo } from "@/lib/api";
import EditTodoForm from "@/components/EditTodoForm";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { Todo } from "@/types/todo";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";

export default function TodoListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    enabled: !!user, // Only fetch when user is logged in
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [advice, setAdvice] = useState("");
  const todosPerPage = 10;

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? todo.completed
        : !todo.completed;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastTodo = currentPage * todosPerPage;
  const currentTodos = filteredTodos.slice(
    indexOfLastTodo - todosPerPage,
    indexOfLastTodo
  );
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const fetchAdvice = async () => {
    try {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();
      setAdvice(data.slip.advice);
    } catch (error) {
      console.error("Failed to fetch advice:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Checking authentication...</p>
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
          <p className="text-lg">Loading todos from database...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold mb-2">Failed to load todos</p>
          <p className="mb-4">Please check your Supabase configuration</p>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <ThemeToggle />

      <button
        onClick={handleSignOut}
        className="fixed top-4 left-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors z-40"
      >
        Sign Out
      </button>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">📝 My Todo App</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Welcome, {user.email} 👋
        </p>
        {advice && <h2 className="text-xl italic mb-4">{advice}</h2>}
        <button
          onClick={fetchAdvice}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Get Advice
        </button>
      </header>

      <section className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/new">
            <button className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold mb-4">
              ➕ Add New Todo
            </button>
          </Link>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search todos..."
              className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value as "all" | "completed" | "incomplete")
              }
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        {currentTodos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              {searchTerm || filter !== "all"
                ? "No todos match your search"
                : "No todos yet. Create your first one!"}
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {currentTodos.map((todo) => (
              <li
                key={todo.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700"
              >
                {editingTodoId === todo.id ? (
                  <EditTodoForm
                    todo={todo}
                    onUpdate={(updatedTodo) => {
                      updateMutation.mutate({
                        id: updatedTodo.id,
                        title: updatedTodo.title,
                        completed: updatedTodo.completed,
                      });
                      setEditingTodoId(null);
                    }}
                    onCancel={() => setEditingTodoId(null)}
                  />
                ) : (
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() =>
                          updateMutation.mutate({
                            id: todo.id,
                            completed: !todo.completed,
                          })
                        }
                        className="w-5 h-5 cursor-pointer"
                      />
                      <div>
                        <span
                          className={`text-sm font-semibold ${
                            todo.completed
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        >
                          {todo.completed ? "Done" : "Not Done"}
                        </span>
                        <Link
                          href={`/todo/${todo.id}`}
                          className="block mt-1 hover:underline"
                        >
                          <strong
                            className={`${
                              todo.completed ? "line-through opacity-60" : ""
                            }`}
                          >
                            {todo.title}
                          </strong>
                        </Link>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingTodoId(todo.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this todo?"
                            )
                          ) {
                            deleteMutation.mutate(todo.id);
                          }
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </section>

      <footer className="text-center mt-12 pt-8 border-t border-gray-300 dark:border-gray-700">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="italic">Joanna Bassey</span> My Todo App
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Database: Supabase PostgreSQL | User: {user.email}
        </p>
      </footer>
    </main>
  );
}
