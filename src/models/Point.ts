export default class Point {
  thingId: string = "";
  layerId: string = "";
  shortNote: string = "";
  htmlNote: string = "";

  public constructor(init?: Partial<Point>) {
    Object.assign(this, init);
  }
}
