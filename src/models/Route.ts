import { Game, Branch, Thing } from "./";

export default class Route {
  name: string;
  url: string;
  game: Game;
  version: string;
  branches: Branch[] = [];
  things: Record<string, Thing> = {};

  constructor(name: string, url: string, game: Game, version: string) {
    this.name = name;
    this.url = url;
    this.game = game;
    this.version = version;
  }
}
