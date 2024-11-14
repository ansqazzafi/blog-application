import { User } from "src/modules/user/user.schema";

export interface SuccessHandler<T=any>{
    success: boolean,
    statusCode: number,
    message: string,
    data: T,
}



export interface loginUser{
    user:User,
    tokens:{
        accessToken:string,
        refreshToken:string
    }
}