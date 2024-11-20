import { RegisterUserAddress } from "./user.interface";


  export interface loginResponse{
    user:{
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      bio: string;
      phoneNumber: string;
      isAdmin:boolean
      address: RegisterUserAddress;
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

