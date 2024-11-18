import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';
import { PostCategory } from 'src/enums/post.enum'; 

@Schema({ timestamps: true })
export class Post {

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  authorId: MongooseSchema.Types.ObjectId; 

  @Prop({ required: true, default: false })
  status?: boolean; 

  @Prop({ required: true, enum: PostCategory })  
  category: PostCategory; 

  @Prop({ default: 0  , required:false})
  likes?: number; 
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
