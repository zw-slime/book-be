export interface UserInfo {
  id: number;
  email: string;
  username: string;
}

export interface User {
  id: number;
  username?: string;
  password?: string;
  email?: string;
}
