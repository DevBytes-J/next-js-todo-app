import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodo } from "@/lib/api";
import { Todo, UpdateTodoInput } from "@/types/todo";

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, UpdateTodoInput>({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
