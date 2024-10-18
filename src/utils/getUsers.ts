import { IPokemon } from "./model";

export default async function getUsersAPI(pokemonsArray: IPokemon[]) {
  try {
    const [
      pikachuResponse,
      charmanderResponse,
      blastoiseResponse,
      bulbasaurResponse,
    ] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/pikachu`),
      fetch(`https://pokeapi.co/api/v2/pokemon/charizard`),
      fetch(`https://pokeapi.co/api/v2/pokemon/blastoise`),
      fetch(`https://pokeapi.co/api/v2/pokemon/bulbasaur`),
    ]);
    const [pikachuData, charmanderData, blastoiseData, bulbasaurData] =
      await Promise.all([
        pikachuResponse.json(),
        charmanderResponse.json(),
        blastoiseResponse.json(),
        bulbasaurResponse.json(),
      ]);
    let pokemonsArray: IPokemon[] = [];
    pokemonsArray = [
      {
        id: 0,
        name: pikachuData.name,
        imgURL: pikachuData.sprites.other.dream_world.front_default,
      },
      {
        id: 1,
        name: charmanderData.name,
        imgURL: charmanderData.sprites.other.dream_world.front_default,
      },
      {
        id: 2,
        name: blastoiseData.name,
        imgURL: blastoiseData.sprites.other.dream_world.front_default,
      },
      {
        id: 3,
        name: bulbasaurData.name,
        imgURL: bulbasaurData.sprites.other.dream_world.front_default,
      },
    ];
    return pokemonsArray;
  } catch (error) {
    console.error("Opa, pokemom errado", error);
    return pokemonsArray;
  }
}
