export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: number;
          title: string;
          completed: boolean;
          user_id: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          title: string;
          completed?: boolean;
          user_id?: number;
        };
        Update: {
          id?: number;
          title?: string;
          completed?: boolean;
        };
      };
    };
  };
}
