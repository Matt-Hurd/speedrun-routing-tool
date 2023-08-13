export default class Thing {
  uid: string = "";
  name: string = "";
  coordinates: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
  layerId: string = "";
  dependencyIds: string[] = [];
  icon: string = "";
  type: string = "";
  isNativeObject: boolean = true;
}

export class Korok extends Thing {
  korokType: string = "";
}

export class Shrine extends Thing {
  isProvingGrounds: boolean = false;
  subText: string = "";
}

export class Item extends Thing {
  itemSpecificProperty: any;
}
