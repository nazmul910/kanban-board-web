export interface ICreateTask {
  title: string;
  description?: string;
  columnId: string;
  position?: number;
}

export interface IUpdateTask {
  title?: string;
  description?: string | null;
}

export interface IMoveTask {
  destinationColumnId: string;
  destinationIndex: number;
}
