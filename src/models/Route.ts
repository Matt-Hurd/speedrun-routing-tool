import { Game, Branch, Thing } from "./";

export default class Route {
  name: string;
  url: string;
  game: Game;
  branches: Branch[] = [];
  things: Record<string, Thing> = {};

  constructor(name: string, url: string, game: Game) {
    this.name = name;
    this.url = url;
    this.game = game;
  }
}
