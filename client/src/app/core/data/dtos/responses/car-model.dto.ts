import {BrandDTO} from './brand.dto';

export interface CarModelDTO {
  id: string;
  name: string;
  brand: BrandDTO;
}
