type Status = "Para Fazer" | "Em Andamento" | "Concluido";
type Tag = "Front-End" | "Back-End" | "Data" | "UX / UI";

export default interface CardEntity {
  id: number;
  status: Status;
  tag: Tag;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
}
