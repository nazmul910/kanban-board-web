import { IBoardUser } from "../board/boardInterface";

export interface ITask {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  columnId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: IBoardUser;
}

export interface IMoveTaskPayload {
  id: string;
  boardId: string;
  destinationColumnId: string;
  destinationIndex: number;
}
