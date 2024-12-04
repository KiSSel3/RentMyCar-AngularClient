import {CarBodyType} from '../../../core/data/enums/car-body-type.enum';
import {CarDriveType} from '../../../core/data/enums/car-drive-type.enum';
import {CarTransmissionType} from '../../../core/data/enums/car-transmission-type.enum';

export interface CarRequestDTO {
  modelId: string;
  bodyType: CarBodyType;
  driveType: CarDriveType;
  transmissionType: CarTransmissionType;
  modelYear: Date;
  image?: File;
}
