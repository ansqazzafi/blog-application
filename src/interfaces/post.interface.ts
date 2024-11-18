import { PostCategory } from "src/enums/post.enum";

export interface createPost{
    title:string,
    content:string,
    status?:boolean,
    category:PostCategory
    likes?:number

}