import { TagManager, FilterTaskUserManager } from "./tagsUsers";
type Status = "to do" | "in progress" | "completed";
type Tag = "Front-End" | "Back-End" | "UX / UI" | "Data";

interface CardEntity {
  id: number;
  status: Status;
  tag: Tag;
  description: string;
  createdBy: string;
  createdAt: string;
}

let tasksTeste: CardEntity[] = [];
tasksTeste.push(
  {
    id: 0,
    status: "to do",
    tag: "Front-End",
    description: "description 0",
    createdBy: "pikachu",
    createdAt: String(new Date()),
  },
  {
    id: 1,
    status: "in progress",
    tag: "Back-End",
    description: "description 1",
    createdBy: "charizard",
    createdAt: String(new Date()),
  },
  {
    id: 2,
    status: "in progress",
    tag: "UX / UI",
    description: "description 2",
    createdBy: "pikachu",
    createdAt: String(new Date()),
  },
  {
    id: 3,
    status: "completed",
    tag: "Data",
    description: "description 3",
    createdBy: "blastoise",
    createdAt: String(new Date()),
  },
  {
    id: 4,
    status: "completed",
    tag: "Data",
    description: "description 4",
    createdBy: "bulbasaur",
    createdAt: String(new Date()),
  }
);

export function filterTasks(): CardEntity[] {
  let orderedTasks: CardEntity[] = [...tasksTeste];

  const tagStorage = localStorage.getItem("selectedTag");
  const userStorage = localStorage.getItem("selectedFilterUser");
  const statusStorage = localStorage.getItem("selectedStatus");

  if (tagStorage) {
    const tag = JSON.parse(tagStorage);
    orderedTasks = orderedTasks.filter((task) => task.tag === tag);
  }

  if (userStorage) {
    const userId = Number(JSON.parse(userStorage));
    let user: string = "";
    switch (userId) {
      case 0:
        user = "pikachu";
        break;
      case 1:
        user = "charizard";
        break;
      case 2:
        user = "blastoise";
        break;
      case 3:
        user = "bulbasaur";
        break;
    }
    orderedTasks = orderedTasks.filter((task) => task.createdBy === user);
  }

  if (statusStorage) {
    const status = JSON.parse(statusStorage);
    orderedTasks = orderedTasks.filter((task) => task.status === status);
  }

  return orderedTasks;
}

// pro futudo:
export function dateOrder(sortBy: number) {
  let orderedTasks: CardEntity[] = tasksTeste;
  switch (sortBy) {
    case 0:
      // mais recentes primeiro
      orderedTasks = orderedTasks.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      break;
    case 1:
      // mais velho primeiro
      orderedTasks = orderedTasks.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
      break;
  }
}
