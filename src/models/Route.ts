import { Game, Point, Branch } from "./";

export default class Route {
    id: string;
    name: string;
    branches: Branch[];
    game: Game;

    pointsFlatList: Point[];
    pointIndices: Map<Point, number>;
  
    constructor(id: string, name: string, game: Game) {
      this.id = id;
      this.name = name;
      this.branches = [];
      this.game = game;

      this.pointsFlatList = [];
      this.pointIndices = new Map();
  
      this.branches.forEach(branch => {
        branch.points.forEach(point => {
          this.pointsFlatList.push(point);
          this.pointIndices.set(point, this.pointsFlatList.length - 1);
        });
      });
    }
  }
  