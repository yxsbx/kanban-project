type Status = "to do" | "in progress" | "completed";
type Tag = "frontend" | "backend" | "ux";

export default interface CardEntity {
  id: number;
  status: Status;
  tag: Tag;
  name: string;
  description: string;
  //createdBy: string;
  createdAt: string;
}
