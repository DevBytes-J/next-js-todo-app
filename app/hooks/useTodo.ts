import { useQuery } from "@tanstack/react-query";
import { fetchTodoById } from "@/lib/api";
import { Todo } from "@/types/todo";

export const useTodo = (id: string) => {
  return useQuery<Todo, Error>({
    queryKey: ["todo", id],
    queryFn: () => fetchTodoById(id),
    enabled: !!id,
  });
};
