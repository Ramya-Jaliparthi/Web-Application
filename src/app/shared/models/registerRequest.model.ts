import {LoginRequest} from './loginRequest.model';

export class RegisterRequest extends LoginRequest  {
  regtypein = '';
  receiveinfo = true;
  tandcagreed = true;
}
