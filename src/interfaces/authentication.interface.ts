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
    isAdmin?:boolean
    address: UserAddress;
  }


  export interface LoginDtoInterface {
    username?: string;
    email?: string;
    password: string;
  }


  export interface loginResponse{
    user:{
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      bio: string;
      phoneNumber: string;
      status: boolean;
      isAdmin:boolean
      address: UserAddress;
      posts:[]
    },
    tokens:{
      accessToken:string,
      refreshToken:string
    }
  }


  export interface refreshTokenResponse{
    tokens:{
      accessToken:string,
      refreshToken:string
    }
  }

