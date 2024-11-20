import { Controller, Req, Post, Body, Param, Get, Delete, Query, ForbiddenException, NotFoundException, UnauthorizedException, Patch, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { PostService } from './post.service';
import { updatePostDto } from 'src/dto/post/update-post.dto';
import { Post as Blog } from './post.schema';
import { ResponseHandler } from 'src/utility/success-response';
import { VerifyAdminGuard } from 'src/guards/verify-admin.guard';
import { status } from 'src/enums/poststatus.enum';
@Controller('post')
export class PostController {

    constructor(private readonly postService: PostService,
        private readonly responseHandler: ResponseHandler
    ) { }

    @Post('create-post')
    public async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request): Promise<SuccessHandler> {
        console.log("Entered");
        console.log("Credentials of Post:", createPostDto);
        const user = req.user;
        console.log(req.user, "user");
        return await this.postService.createPost(user.id, createPostDto);
    }

    @Delete('delete-post/:postId')
    public async deletePost(@Param('postId') postId: string, @Req() req: Request): Promise<SuccessHandler> {
        console.log("Deleting post with ID:", postId);
        const user = req.user;
        if (!user) {
            throw new UnauthorizedException("User not authenticated");
        }

        console.log("Authenticated user:", user);
        return await this.postService.deletePost(postId, user.id);
    }

    @Patch('update-post/:postId')
    public async updatePost(@Param() postId: string, @Body() updatePostDto: updatePostDto): Promise<SuccessHandler<Blog>> {
        console.log("UpdatedDto :", updatePostDto)
        return await this.postService.updatePost(postId, updatePostDto)
    }

    @Get('get-posts')
    @UseGuards(VerifyAdminGuard)
    public async getAllPosts(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<SuccessHandler<Blog[]>> {
        console.log("Entered");
        
        return await this.postService.getPaginatedPosts(page, limit);
    }


    @Get('get-active-posts')
    public async getActivePosts(
        @Query('page') page:number =1,
        @Query('limit') limit: number=10
    ):Promise<SuccessHandler<Blog[]>>{
        return await this.postService.getActivePaginatedPosts(page , limit)
    }



   
}

