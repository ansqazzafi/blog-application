import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserAddress } from 'src/interfaces/user.interface';  

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

  @Prop({ required: false, default: false })
  status: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;


  @Prop({ required:false })
  bio: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: true,
    type: {
        city: { type: String, required: true },
        country: { type: String, required: true }, 
      },
   })
  address: UserAddress;  

  @Prop({ required: false })
  refreshToken: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
