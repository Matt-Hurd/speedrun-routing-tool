import Point from "./Point";

export default class Branch {
  name: string;
  shortNote: string = "";
  htmlNote: string = "";
  points: Point[];

  constructor(
    name: string) {

    this.name = name;
    this.points = [];
  }
}
