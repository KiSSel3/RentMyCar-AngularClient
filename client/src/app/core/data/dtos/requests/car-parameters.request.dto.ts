import {CarTransmissionType} from '../../enums/car-transmission-type.enum';
import {CarDriveType} from '../../enums/car-drive-type.enum';
import {CarBodyType} from '../../enums/car-body-type.enum';
import {PaginationRequestDTO} from './pagination.request.dto';

export interface CarParametersRequestDTO extends PaginationRequestDTO {
  modelId?: string;
  bodyType?: CarBodyType;
  driveType?: CarDriveType;
  transmissionType?: CarTransmissionType;
  year?: Date;
  minYear?: Date;
  maxYear?: Date;
}
