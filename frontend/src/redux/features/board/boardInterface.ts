import { IColumn } from "../column/columnInterface";

export type BoardRole = "OWNER" | "EDITOR" | "VIEWER";

export interface IBoardUser {
  id: string;
  name: string;
  email: string;
}

export interface IBoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: BoardRole;
  createdAt: string;
  user: IBoardUser;
}

export interface IBoard {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: IBoardUser;
  members: IBoardMember[];
  columns?: IColumn[];
  _count?: {
    columns: number;
  };
}

export interface IBoardState {
  selectedBoardId: string | null;
  searchQuery: string;
}
