import { indiaVehicles } from "./india";
import { usaVehicles } from "./usa";
import { europeVehicles } from "./europe";
import { chinaVehicles } from "./china";
import { japanVehicles } from "./japan";
import { koreaVehicles } from "./korea";
import { otherVehicles } from "./other";

export const vehicles = [
  ...indiaVehicles,
  ...usaVehicles,
  ...europeVehicles,
  ...chinaVehicles,
  ...japanVehicles,
  ...koreaVehicles,
  ...otherVehicles,
];