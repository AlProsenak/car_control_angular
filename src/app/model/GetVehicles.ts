import {Vehicle} from './Vehicle';
import {Pageable} from './Pageable';

export interface GetVehicles {
  vehicles: Vehicle[];
  pageable: Pageable;
}
