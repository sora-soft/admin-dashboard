import {ErrorString} from './ErrorString';

class BaseError extends Error {
  constructor(message: string, code: string) {
    if (code && ErrorString[code]) {
      message = ErrorString[code];
    }
    super(code);
    this.code = code;
    this.showMessage = message;
  }

  public showMessage: string;
  public code: string;
}

export {BaseError};
