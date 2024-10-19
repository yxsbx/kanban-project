import { TagManager, FilterTaskUserManager } from "./tagsAndUsers";
type Status = "Para Fazer" | "Em Andamento" | "Concluido";
type Tag = "Front-End" | "Back-End" | "UX / UI" | "Data";

interface CardEntity {
  id: number;
  status: Status;
  tag: Tag;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
}

let tasksArray = localStorage.getItem("arrayCards");
let parsedTasksArray: CardEntity[] = [];
if (tasksArray) {
  parsedTasksArray = JSON.parse(tasksArray);
} else {
  parsedTasksArray = [];
}

export function filterTasks(searchValue?: string): CardEntity[] {
  let orderedTasks: CardEntity[] = [...parsedTasksArray];

  const tagStorage = new TagManager();
  const userStorage = new FilterTaskUserManager();
  const statusStorage = localStorage.getItem("selectedStatus");

  if (tagStorage.getSelectedTag()) {
    const tag = tagStorage.getSelectedTag();
    orderedTasks = orderedTasks.filter((task) => task.tag === tag);
  }

  if (userStorage.getFilterSelectedUser()) {
    const userId = Number(userStorage.getFilterSelectedUser());
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

  if (searchValue) {
    orderedTasks = orderedTasks.sort((a, b) => {
      const taskA = a.name.toLowerCase();
      const taskB = b.name.toLowerCase();
      const search = searchValue.toLowerCase();

      const aContains = taskA.includes(search);
      const bContains = taskB.includes(search);

      // se tem na A e não na B => A primeiro
      if (aContains && !bContains) return -1;
      // se tem na B e não na A => B vem primeiro
      if (!aContains && bContains) return 1;

      // se não achar => faz nada
      return 0;
    });
  }
  console.log(orderedTasks);
  return orderedTasks;
}

// pro futudo:
export function sortByDate(sortBy: number) {
  let orderedTasks: CardEntity[] = parsedTasksArray;
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
