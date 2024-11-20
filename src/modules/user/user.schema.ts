import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { RegisterUserAddress } from 'src/interfaces/user.interface';  
@Schema({ timestamps: true })
export class User {

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isAdmin: boolean;


  @Prop({ required:false })
  bio: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({
    type: {
        city: { type: String, required: true },
        country: { type: String, required: true }, 
      },
   })
  address: RegisterUserAddress;  

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Post' }],
    default: [],
  })
  posts: MongooseSchema.Types.ObjectId[];

  @Prop({ required: false })
  refreshToken: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
