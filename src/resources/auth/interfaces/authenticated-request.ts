import { PayloadDto } from '../dto/payload.dto';

export interface AuthenticatedRequest extends Request {
  user: PayloadDto;
}
