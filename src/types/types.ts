export interface Truck {
  id: string;
  number: string;
  type: string;
  status: "lineup" | "outOfService";
  position: number;
}
