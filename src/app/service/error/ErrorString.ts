import {UserErrorCode} from '../server/api';

export const ErrorString = {
  ERR_NET: '网络通讯发生错误',

  [UserErrorCode.ERR_AUTH_DENY]: '没有权限进行该操作',
  [UserErrorCode.ERR_USERNAME_NOT_FOUND]: '该账户不存在'
};
