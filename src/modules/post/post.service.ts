import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './post.schema';  
import { CreatePostDto } from 'src/dto/post/create-post.dto';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { ResponseHandler } from 'src/utility/success-response';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>,
  @InjectModel(User.name) private userModel:Model<UserDocument>,
 private readonly reponseHandler:ResponseHandler) {}
  public async createPost( id:string , createPostDto:CreatePostDto):Promise<SuccessHandler>{
    const session = await this.postModel.db.startSession();
    session.startTransaction();
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

  }



}
