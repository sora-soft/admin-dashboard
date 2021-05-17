import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, delay, map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {ErrorLevel} from './error/ErrorUtil';
import {NetError} from './error/NetError';
import {ServerError} from './error/ServerError';
import {UserError} from './error/UserError';
import {AuthHandler, GatewayHandler, RestfulHandler, ServiceName, UserErrorCode} from './server/api';

// tslint:disable-next-line
interface IRemoteService {}
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type TypeOfClassMethod<T, M extends keyof T> = T[M] extends (...args: any) => any ? T[M] : never;
export type ConvertRouteMethod<T extends IRemoteService> = {
  [K in keyof T]: (body: Parameters<TypeOfClassMethod<T, K>>[0]) => Observable<ThenArg<ReturnType<TypeOfClassMethod<T, K>>>>;
};

interface IResNetResponse<T> {
  error: {
    code: string;
    message: string;
    level: ErrorLevel;
    name: string;
  };
  result: T;
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  gateway: ConvertRouteMethod<GatewayHandler>;
  restful: ConvertRouteMethod<RestfulHandler>;
  auth: ConvertRouteMethod<AuthHandler>;

  constructor(private http: HttpClient) {
    this.gateway = this.createHttpService(ServiceName.HttpGateway);
    this.restful = this.createHttpService(ServiceName.Restful);
    this.auth = this.createHttpService(ServiceName.Auth);
  }

  private createHttpService<Handler>(name: ServiceName): ConvertRouteMethod<Handler> {
    return new Proxy({} as any, {
      get: (target, prop: string, receiver) => {
        // const url = new URL(`${name}/${prop}`, environment.server).href;
        return (body) => {
          return this.http.post<IResNetResponse<unknown>>(`${environment.server}${name}/${prop}`, body || {}, {
            withCredentials: true
          }).pipe(
            catchError((error: Error) => {
              throw new NetError(error.message);
            }),
            map(this.handlerResNetResponse.bind(this)),
          );
        };
      }
    });
  }

  private handlerResNetResponse(res: IResNetResponse<unknown>) {
    if (res.error) {
      switch (res.error.level) {
        case ErrorLevel.EXPECTED:
          throw new UserError(res.error.code as UserErrorCode, res.error.message);
        default:
          throw new ServerError(res.error.code);
      }
    }
    return res.result;
  }
}
