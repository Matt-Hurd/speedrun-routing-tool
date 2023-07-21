export default class Layer {
  name: string;
  imagePath: string; // Path to the image file for the layer
  baseImagePath: string;

  constructor(name: string, imagePath: string, baseImagePath: string) {
    this.name = name;
    this.imagePath = imagePath;
    this.baseImagePath = baseImagePath;
  }
}
