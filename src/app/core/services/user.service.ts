import { User } from "../interfaces";
import { LocalStorageService } from "./local-storage.service";

const USERS_KEY = "users";

export class UserService {
  async getUsers(): Promise<User[]> {
    let users = LocalStorageService.getFromLocalStorage<User[]>(USERS_KEY);

    if (users && users.length > 0) {
      return users;
    }

    users = await this.fetchUsersFromAPI();
    LocalStorageService.saveToLocalStorage(USERS_KEY, users);
    return users;
  }

  getUserById(userId: string): User | undefined {
    const users = this.getUsersFromStorage();
    return users.find((user) => user.id === userId);
  }

  addUser(user: User): void {
    const users = this.getUsersFromStorage();
    users.push(user);
    LocalStorageService.saveToLocalStorage(USERS_KEY, users);
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsersFromStorage();
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    LocalStorageService.saveToLocalStorage(USERS_KEY, updatedUsers);
  }

  deleteUser(userId: string): void {
    const users = this.getUsersFromStorage();
    const updatedUsers = users.filter((user) => user.id !== userId);
    LocalStorageService.saveToLocalStorage(USERS_KEY, updatedUsers);
  }

  private getUsersFromStorage(): User[] {
    return LocalStorageService.getFromLocalStorage<User[]>(USERS_KEY) || [];
  }

  private async fetchUsersFromAPI(): Promise<User[]> {
    const users: User[] = [
      {
        id: "1",
        name: "Ash Ketchum",
        avatar: "",
      },
      { id: "2", name: "Brock", avatar: "" },
      { id: "3", name: "Misty", avatar: "" },
      { id: "4", name: "May", avatar: "" },
      { id: "5", name: "James", avatar: "" },
      {
        id: "6",
        name: "Felipe Costa",
        avatar: "",
      },
      {
        id: "7",
        name: "Eric Mescouto",
        avatar: "",
      },
      {
        id: "8",
        name: "Yasmin Barcelos",
        avatar: "",
      },
    ];

    try {
      const pokemonNames = [
        "pikachu",
        "onix",
        "togepi",
        "skitty",
        "meowth",
        "charizard",
        "blastoise",
        "bulbasaur",
      ];

      const pokemonPromises = pokemonNames.map((name) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) =>
          res.json()
        )
      );

      const pokemonData = await Promise.all(pokemonPromises);

      users[0].avatar = pokemonData[0].sprites.other.dream_world.front_default;
      users[1].avatar = pokemonData[1].sprites.other.dream_world.front_default;
      users[2].avatar = pokemonData[2].sprites.other.dream_world.front_default;
      users[3].avatar = pokemonData[3].sprites.other.dream_world.front_default;
      users[4].avatar = pokemonData[4].sprites.other.dream_world.front_default;
      users[5].avatar = pokemonData[5].sprites.other.dream_world.front_default;
      users[6].avatar = pokemonData[6].sprites.other.dream_world.front_default;
      users[7].avatar = pokemonData[7].sprites.other.dream_world.front_default;

      return users;
    } catch (error) {
      console.error("Erro ao carregar Pokémon:", error);
      return users;
    }
  }
}
