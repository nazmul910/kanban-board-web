export interface ICreateColumn {
  title: string;
  boardId: string;
  position?: number;
}

export interface IUpdateColumn {
  title?: string;
  position?: number;
}

export interface IReorderColumns {
  columns: {
    id: string;
    position: number;
  }[];
}
