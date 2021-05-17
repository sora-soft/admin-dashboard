import {BaseError} from './BaseError';

class NetError extends BaseError {
  constructor(message: string) {
    super(message, 'ERR_NET');
    Object.setPrototypeOf(this, NetError.prototype);
  }
}

export {NetError};
