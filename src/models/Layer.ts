export default class Layer {
  name: string;
  imagePath: string;
  baseImagePath: string;
  bounds: [[number, number], [number, number]];
  rotation: number;
  offset: [number, number, number];
  distance: number;

  constructor(
    name: string,
    imagePath: string,
    baseImagePath: string,
    bounds: [[number, number], [number, number]] = [
      [-5000, 6000],
      [5000, -6000],
    ],
    rotation: number = 0,
    offset: [number, number, number] = [0, 0, 0],
    distance: number = 0
  ) {
    this.name = name;
    this.imagePath = imagePath;
    this.baseImagePath = baseImagePath;
    this.bounds = bounds;
    this.rotation = rotation;
    this.offset = offset;
    this.distance = distance;
  }
}
