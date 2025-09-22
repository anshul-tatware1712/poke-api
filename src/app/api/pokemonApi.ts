import axios from "axios";

const POKEMON_API_BASE_URL = "https://pokeapi.co/api/v2/";

const pokemonApi = axios.create({
  baseURL: POKEMON_API_BASE_URL,
  validateStatus: (status) => status >= 200 && status < 300,
});

export default pokemonApi;
