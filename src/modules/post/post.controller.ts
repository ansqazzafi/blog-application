import { Controller, Req , Post } from '@nestjs/common';
import { Request } from 'express';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { PostService } from './post.service';

@Controller('post')
export class PostController {

    constructor(private readonly postService:PostService){}

    @Post('create-post')
    async createPost(
        createPostDto:CreatePostDto,
        @Req() req:Request
    ):Promise<SuccessHandler>{
        const user = req.user
        return await this.postService.createPost(user.id , createPostDto)
    }
}
