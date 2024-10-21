import { CardTypesEnum } from "@app/core/enums";

export interface Card {
  id: string;
  title: string;
  type: CardTypesEnum;
  columnId: string;
  priority: string;
  assigneeId: string;
  reporterId: string;
  labels: Array<string>;
  description: string;
  startDate: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PartialCard {
  id: string;
  title?: string;
  type?: CardTypesEnum;
  columnId: string;
  description?: string;
  priority?: string;
  assigneeId?: string;
  reporterId?: string;
  labels?: Array<string>;
  startDate?: string;
  dueDate?: string;
}
