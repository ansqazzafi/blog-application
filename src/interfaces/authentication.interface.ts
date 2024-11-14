import { UserAddress } from "./user.interface";
export interface RegisterDtoInterface {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    bio?: string;
    phoneNumber?: string;
    status?: boolean;
    address: UserAddress;
    refreshToken?: string;
  }


  export interface LoginDtoInterface {
    username?: string;
    email?: string;
    password: string;
  }

