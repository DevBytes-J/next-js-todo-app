export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  user_id: string; // Changed from number to string (UUID)
  created_at?: string;
  updated_at?: string;
}

export interface CreateTodoInput {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoInput {
  id: number;
  title?: string;
  completed?: boolean;
}
