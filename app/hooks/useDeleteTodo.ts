import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "@/lib/api";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | number>({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
