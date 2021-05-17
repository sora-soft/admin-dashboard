import {UserErrorCode} from '../server/api';
import {BaseError} from './BaseError';
import {ErrorString} from './ErrorString';

class UserError extends BaseError {
  constructor(code: UserErrorCode, message: string) {
    super(code, code);
    Object.setPrototypeOf(this, UserError.prototype);
  }
}

export {UserError};
