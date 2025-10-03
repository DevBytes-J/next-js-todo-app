import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "@/lib/api";
import { CreateTodoInput, Todo } from "@/types/todo";

export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, CreateTodoInput>({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
