import { ForbiddenException, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { ResponseHandler } from 'src/utility/success-response';
import { User, UserDocument } from '../user/user.schema';
import { updatePostDto } from 'src/dto/post/update-post.dto';
import { error } from 'console';
import { status } from 'src/enums/poststatus.enum';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly reponseHandler: ResponseHandler
  ) { }

  public async createPost(id: string, createPostDto: CreatePostDto): Promise<SuccessHandler> {
    const session = await this.postModel.db.startSession();
    session.startTransaction();
    try {
      const createdPost = new this.postModel({
        authorId: id,
        ...createPostDto,
      });
      await createdPost.save({ session });
      await this.userModel.findOneAndUpdate(
        { _id: id },
        { $push: { posts: createdPost._id } },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      return this.reponseHandler.successHandler(createdPost, "Post created successfully");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error('Transaction failed, post not created');
    }
  }


  public async deletePost(postId: string, userId: string): Promise<SuccessHandler> {
    const session = await this.postModel.db.startSession();
    session.startTransaction();

    try {
      await this.postModel.findByIdAndDelete(postId, { session });
      await this.userModel.findByIdAndUpdate(
        userId,
        { $pull: { posts: postId } },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      return this.reponseHandler.successHandler(null, "Post Deleted Successfully");

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Transaction failed: ${error.message}`);
    }
  }


  public async updatePost(postId: string, updatePostDto: updatePostDto): Promise<SuccessHandler<Post>> {
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      { $set: updatePostDto }
    )

    if (!updatePostDto) {
      throw new NotFoundException("Post are not Found")
    }

    return this.reponseHandler.successHandler(updatedPost, "Post Updated Sucessfully")
  }


  // public async getPaginatedPosts(page: number, limit: number): Promise<SuccessHandler<Post[]>> {
  //   try {
  //     if (page <= 0 || limit <= 0) {
  //       throw new BadRequestException("Page and limit must be positive integers.");
  //     }
  //     const skip = (page - 1) * limit;
  //     const totalPosts = await this.postModel.countDocuments();
  //     const totalPages = Math.ceil(totalPosts / limit);
  //     const posts = await this.postModel.find()
  //       .skip(skip)
  //       .limit(limit);
  //     if (!posts || posts.length === 0) {
  //       throw new NotFoundException("No posts found");
  //     }
  //     const updatedPosts = {
  //       posts,
  //       totalPages,
  //       totalPosts
  //     }
  //     return this.reponseHandler.successHandler(updatedPosts, "Posts fetched successfully");

  //   } catch (error) {
  //     console.error('Error fetching posts:', error);
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new ForbiddenException("An error occurred while fetching posts");
  //   }
  // }

  // public async getActivePaginatedPosts(page:number , limit:number):Promise<SuccessHandler<Post[]>>{
  //   try {
  //     if (page <= 0 || limit <= 0) {
  //       throw new BadRequestException("Page and limit must be positive integers.");
  //     }
  //     const skip = (page - 1) * limit;
  //     const totalPosts = await this.postModel.countDocuments();
  //     const totalPages = Math.ceil(totalPosts / limit);
  //     const posts = await this.postModel.find({status:true})
  //       .skip(skip)
  //       .limit(limit);
  //     if (!posts || posts.length === 0) {
  //       throw new NotFoundException("No posts found");
  //     }
  //     const updatedPosts = {
  //       posts,
  //       totalPages,
  //       totalPosts
  //     }
  //     return this.reponseHandler.successHandler(updatedPosts, "Posts fetched successfully");

  //   } catch (error) {
  //     console.error('Error fetching posts:', error);
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new ForbiddenException("An error occurred while fetching posts");
  //   }

  // }





  public async getActivePaginatedPosts(
    page: number, 
    limit: number, 
  ): Promise<SuccessHandler<Post[]>> {
    try {
      if (page <= 0 || limit <= 0) {
        throw new BadRequestException("Page and limit must be positive integers.");
      }
      const skip = (page - 1) * limit;
      const totalPosts = await this.postModel.countDocuments({ status: status.Active });
      const totalPages = Math.ceil(totalPosts / limit);
  
      const posts = await this.postModel.find({ status: status.Active })
        .skip(skip)
        .limit(limit);
  
      if (posts.length === 0) {
        throw new NotFoundException("No active posts found.");
      }
  
      const updatedPosts = {
        posts,
        totalPages,
        totalPosts
      };
  
      return this.reponseHandler.successHandler(updatedPosts, "Posts fetched successfully");
    } catch (error) {
      console.error('Error fetching posts:', error);
  
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ForbiddenException("An error occurred while fetching posts");
    }
  }



  public async getPaginatedPosts(
    page: number, 
    limit: number, 
  ): Promise<SuccessHandler<Post[]>> {
    try {
      if (page <= 0 || limit <= 0) {
        throw new BadRequestException("Page and limit must be positive integers.");
      }
      const skip = (page - 1) * limit;
      const totalPosts = await this.postModel.countDocuments({status: { $ne: "Draft" } });
      const totalPages = Math.ceil(totalPosts / limit);
  
      const posts = await this.postModel.find({ status: { $ne: "Draft" } })
        .skip(skip)
        .limit(limit);
  
      if (posts.length === 0) {
        throw new NotFoundException("No active posts found.");
      }
  
      const updatedPosts = {
        posts,
        totalPages,
        totalPosts
      };
  
      return this.reponseHandler.successHandler(updatedPosts, "Posts fetched successfully");
    } catch (error) {
      console.error('Error fetching posts:', error);
  
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ForbiddenException("An error occurred while fetching posts");
    }
  }
  

}
