import Point from "./Point";

export default class Branch {
  name: string;
  notes: string = '';
  points: Point[]; // Array of points in the branch

  constructor(name: string) {
    this.name = name;
    this.points = [];
  }
}
