import { PostCategory } from "src/enums/post.enum";
import { status } from "src/enums/poststatus.enum";

export interface createPost{
    title:string,
    content:string,
    status?:status,
    category:PostCategory
    likes?:number

}
export interface updatePost{
    title?:string,
    content?:string,
    status?:status,
    category?:PostCategory
    likes?:number

}