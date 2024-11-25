import {CarBodyType} from '../../enums/car-body-type.enum';
import {CarDriveType} from '../../enums/car-drive-type.enum';
import {CarTransmissionType} from '../../enums/car-transmission-type.enum';
import {CarModelDTO} from './car-model.dto';

export interface CarDTO {
  id: string;
  bodyType: CarBodyType;
  driveType: CarDriveType;
  transmissionType: CarTransmissionType;
  modelYear: Date;
  image: string;
  carModel: CarModelDTO;
}
