import { supabase } from "./supabase";
import { Todo, CreateTodoInput, UpdateTodoInput } from "@/types/todo";

export const fetchTodos = async (): Promise<Todo[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to fetch todos");
  }

  return data || [];
};

export const fetchTodoById = async (id: string): Promise<Todo> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to fetch todo");
  }

  return data;
};

export const createTodo = async (todo: CreateTodoInput): Promise<Todo> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("todos")
    .insert([
      {
        title: todo.title,
        completed: todo.completed || false,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to create todo");
  }

  return data;
};

export const updateTodo = async (todo: UpdateTodoInput): Promise<Todo> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("todos")
    .update({
      title: todo.title,
      completed: todo.completed,
    })
    .eq("id", todo.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to update todo");
  }

  return data;
};

export const deleteTodo = async (id: string | number): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Supabase error:", error);
    throw new Error("Failed to delete todo");
  }
};
