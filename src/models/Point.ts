export default class Point {
  thingId: string = ""; // Thing to be found/achieved at this point
  notes: string = ""; // Additional notes for the point

  public constructor(init?: Partial<Point>) {
    Object.assign(this, init);
  }
}
