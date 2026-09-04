import { ITask } from "../task/taskInterface";

export interface IColumn {
  id: string;
  title: string;
  position: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  tasks: ITask[];
}
