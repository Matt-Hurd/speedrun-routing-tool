export enum Action {
  Warp = "WARP",
  Complete = "COMPLETE",
  Activate = "ACTIVATE",
  None = "",
}

export default class Point {
  thingId: string = "";
  shortNote: string = "";
  htmlNote: string = "";
  action: Action = Action.None;

  public constructor(init?: Partial<Point>) {
    Object.assign(this, init);
  }
}
