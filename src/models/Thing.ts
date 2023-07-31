export default class Thing {
  id: string = "";
  name: string = "";
  description: string = "";
  coordinates: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  layerId: string = "";
  dependencyIds: string[] = [];
  icon: string = "";
  type: string = "";
}

export class Korok extends Thing {
  korokType: string = "";
}

export class Shrine extends Thing {
  isProvingGrounds: boolean = false;
}

export class Item extends Thing {
  itemSpecificProperty: any;
}
