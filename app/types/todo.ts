export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  user_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTodoInput {
  title: string;
  completed?: boolean;
  user_id?: number;
}

export interface UpdateTodoInput {
  id: number;
  title?: string;
  completed?: boolean;
}
