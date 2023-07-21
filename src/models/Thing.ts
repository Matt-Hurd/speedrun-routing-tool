export default class Thing {
  id: string = "";
  name: string = "";
  description: string = "";
  coordinates: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 }; // Coordinates of the point on a map
  layerId: string = ""; // Layer of the map where the thing is located
  dependencyIds: string[] = [];
  icon: string = "";
}

export class Korok extends Thing {
  korokSpecificProperty: any; // define properties specific to Korok
}

export class Item extends Thing {
  itemSpecificProperty: any; // define properties specific to Item
}
