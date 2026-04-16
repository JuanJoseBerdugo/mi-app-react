
export interface IPokeAbility {
  ability: {
    name: string;
  };
}

export interface IPokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  abilities: IPokeAbility[];
}

export interface IPokeListItem {
  name: string;
  url: string;
}

export interface IPokeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IPokeListItem[];
}

export interface IProducto {
  id: number;
  title: string;
  price: number;
  image: string;
}

export interface ICartItem extends IProducto {
  cantidad: number;
}

// Rick and Morty
export interface IRickCharacter {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  image: string;
  location: { name: string };
  origin: { name: string };
}

export interface IRickListInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface IRickListResponse {
  info: IRickListInfo;
  results: IRickCharacter[];
}
