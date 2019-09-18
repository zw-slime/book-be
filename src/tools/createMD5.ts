import * as crypto from 'crypto';

export function CreateMD5(password, salt) {
  return crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');
}
