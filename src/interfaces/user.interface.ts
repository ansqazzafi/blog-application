export interface UserAddress{
    city:string,
    country:string
}


export interface UpdateDto{
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    bio?: string;
    phoneNumber?: string;
    address?: {
        city?:string,
        country?:string
    };
}