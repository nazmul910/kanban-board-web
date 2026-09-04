import { IBoardUser } from "../board/boardInterface";

export interface IActivity {
  id: string;
  userId: string;
  taskId?: string | null;
  boardId: string;
  action: string;
  details?: string | null;
  createdAt: string;
  user?: IBoardUser;
}
