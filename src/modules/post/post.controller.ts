import { Controller, Req, Post, Body  , Get} from '@nestjs/common';
import { Request } from 'express';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { PostService } from './post.service';

@Controller('post')
export class PostController {

    constructor(private readonly postService: PostService) { }

    @Post('create-post')
    public async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request): Promise<SuccessHandler> {
        console.log("Entered");
        console.log("Credentials of Post:", createPostDto);
        const user = req.user;
        console.log(req.user , "user");
        
        return await this.postService.createPost(user.id, createPostDto);
    }
}
