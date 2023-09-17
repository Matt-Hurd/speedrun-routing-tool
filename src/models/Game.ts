import { Layer } from "./";

export default class Game {
  id: string;
  name: string;
  layers: { [key: string]: Layer };
  icons: { [key: string]: string };

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.layers = {};
    this.icons = {};
  }
}
