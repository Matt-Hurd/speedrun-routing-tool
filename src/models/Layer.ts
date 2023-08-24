export default class Layer {
  name: string;
  imagePath: string;

  constructor(name: string, imagePath: string) {
    this.name = name;
    this.imagePath = imagePath;
  }
}
