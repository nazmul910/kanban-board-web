import { Role } from "@prisma/client";

export interface ICreateBoard {
  title: string;
}

export interface IUpdateBoard {
  title: string;
}

export interface IShareBoard {
  email: string;
  role?: Role;
}

export interface IUpdateMemberRole {
  role: Role;
}
