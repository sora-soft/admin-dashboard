export enum ServiceName {
  Test = 'test',
  HttpGateway = 'http-gateway',
  Restful = 'restful',
  Auth = 'auth',
}
export enum UserErrorCode {
  ERR_DUPLICATE_USERNAME = 'ERR_DUPLICATE_USERNAME',
  ERR_DUPLICATE_EMAIL = 'ERR_DUPLICATE_EMAIL',
  ERR_USERNAME_NOT_FOUND = 'ERR_USERNAME_NOT_FOUND',
  ERR_WRONG_PASSWORD = 'ERR_WRONG_PASSWORD',
  ERR_PARAMETERS_INVALID = 'ERR_PARAMETERS_INVALID',
  ERR_NOT_LOGIN = 'ERR_NOT_LOGIN',

  ERR_AUTH_DENY = 'ERR_AUTH_DENY',

  ERR_DB_NOT_FOUND = 'ERR_DB_NOT_FOUND'
}
export abstract class BaseModel {

  updateAt: Date;


  createAt: Date;


  version: number;
}

export declare class Account extends BaseModel {
    id: string;
    username: string;
    email: string;
    password: string;
    salt: string;
    group: AuthGroup;
    gid: string;
}

export declare class AuthGroup extends BaseModel {
    id: string;
    name: string;
    permissions: AuthPermission[];
}

export declare class AuthPermission extends BaseModel {
    gid: string;
    name: string;
    permission: PermissionResult;
    group: AuthGroup;
}
export enum PermissionResult {
  ALLOW = 1,
  DENY = 2,
}

export declare class AuthHandler {
    updatePermission(body: IUpdatePermissionReq): Promise<void>;
    createAccount(body: IReqCreateAccount): Promise<{ id: string; }>;
}
export interface IUpdatePermissionReq {
  gid: string;
  permissions: {
    name: string;
    permission: PermissionResult;
  }[];
}
export interface IReqCreateAccount {
  username: string;
  email: string;
  gid: string;
  password: string;
}

export declare class GatewayHandler {
    register(body: IRegisterReq): Promise<{ id: string; }>;
    login(body: ILoginReq): Promise<{ account: { username: string; email: string; }; permissions: AuthPermission[]; }>;
    info(body: void): Promise<{ account: { username: string; email: string; }; permissions: AuthPermission[]; }>;
    logout(body: void): Promise<{}>;
}
export interface IRegisterReq {
  username: string;
  password: string;
  email: string;
}
export interface ILoginReq {
  username: string;
  password: string;
}

export declare class RestfulHandler {
    fetch<T>(body: IReqFetch<T>): Promise<{ list: T[]; total: number; }>;
    insert<T>(body: IReqInsert<T>): Promise<T>;
    insertBatch<T>(body: IReqInsertBatch<T>): Promise<T[]>;
    update<T>(body: IReqUpdate<T>): Promise<{}>;
    updateBatch<T>(body: IReqUpdateBatch<T>): Promise<{}>;
    deleteBatch<T>(body: IReqDeleteBatch): Promise<{}>;
}
export interface IReqFetch<T> {
  db: string;
  offset: number;
  limit: number;
  relations?: string[];
  order?: {
    [k: string]: -1 | 1;
  };
  select?: string[];
  where?: WhereCondition<T>;
}
export declare type WhereCondition<T> = Condition<T> | Array<Condition<T>>;
export type Condition<T> = {
    [K in keyof T]?: T[K] | WhereOperatorCondition;
}
export type WhereOperatorCondition = {
    [K in WhereOperators]?: any;
}
export declare enum WhereOperators {
    any = "$any",
    between = "$between",
    eq = "$eq",
    iLike = "$iLike",
    in = "$in",
    isNull = "$isNull",
    lt = "$lt",
    lte = "$lte",
    like = "$like",
    gt = "$gt",
    gte = "$gte",
    not = "$not"
}
export interface IReqInsert<T> {
  db: string;
  data: Partial<T>;
}
export interface IReqInsertBatch<T> {
  db: string;
  list: Partial<T>[];
}
export interface IReqUpdate<T> {
  data: Partial<T>;
  id: any;
  db: string;
}
export interface IReqUpdateBatch<T> {
  db: string;
  list: {
    id: any;
    data: Partial<T>;
  }[];
}
export interface IReqDeleteBatch {
  db: string;
  list: any[];
}

export declare class TestHandler {
    test(body: { test: string; b: string | IDDD; c: AuthGroup; }): Promise<{ test: boolean; }>;
}
export interface IDDD extends ITTT {
  a: AuthGroup;
}
export interface ITTT {
  c: string;
}
