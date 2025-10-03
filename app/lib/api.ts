import { supabase } from "./supabase";
import { Todo, CreateTodoInput, UpdateTodoInput } from "@/types/todo";

export const fetchTodos = async (): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error("Failed to fetch todos");
  return data || [];
};

export const fetchTodoById = async (id: string): Promise<Todo> => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error("Failed to fetch todo");
  return data;
};

export const createTodo = async (todo: CreateTodoInput): Promise<Todo> => {
  const { data, error } = await supabase
    .from("todos")
    .insert([
      {
        title: todo.title,
        completed: todo.completed || false,
        user_id: todo.user_id || 1,
      },
    ])
    .select()
    .single();

  if (error) throw new Error("Failed to create todo");
  return data;
};

export const updateTodo = async (todo: UpdateTodoInput): Promise<Todo> => {
  const { data, error } = await supabase
    .from("todos")
    .update({
      title: todo.title,
      completed: todo.completed,
    })
    .eq("id", todo.id)
    .select()
    .single();

  if (error) throw new Error("Failed to update todo");
  return data;
};

export const deleteTodo = async (id: string | number): Promise<void> => {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw new Error("Failed to delete todo");
};
