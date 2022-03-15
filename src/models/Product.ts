export interface IProductProperties {
  os: string;
  cpu: string;
  memory: string;
  ram: string;
  camera: string;
  batery: string;
  color: string;
  [key: string]: string;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  photo: string;
  properties: IProductProperties;
}