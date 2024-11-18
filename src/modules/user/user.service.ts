import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.schema';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { ResponseHandler } from 'src/utility/success-response';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
NotFoundException
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly responseHandler: ResponseHandler
  ) { }

  public async getSingleUser(id: string): Promise<SuccessHandler> {
    try {
      const user = await this.userModel
        .findById(id)
        .select('-password -refreshToken')
        .exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return this.responseHandler.successHandler(user, `User ${user.firstName} are get successfully`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while fetching the user.');
      }
    }
  }


  public async getUsers(): Promise<SuccessHandler<User[]>> {
    const users = await this.userModel.find().select('-password -refreshToken');

    if (!users) {
      throw new NotFoundException("Users doesn't exist")
    }

    return this.responseHandler.successHandler(users, "List of Users")
  }


  public async updateUser(id:string , updateDto:UpdateUserDto):Promise<SuccessHandler<User>>{
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: updateDto },  
      { new: true, runValidators: true }
    );

    if(!updatedUser){
      throw new NotFoundException("User not found")
    }

    return this.responseHandler.successHandler(updatedUser , "user Updated Successfully")

  }


  public async deleteUser(id:string):Promise<SuccessHandler<User>>{
    const deletedUser = await this.userModel.findByIdAndDelete(id).select('-password -refreshToken')
    if(!deletedUser){
      throw new NotFoundException("User not found")
    }

    return this.responseHandler.successHandler(deletedUser , "User Deleted SuccessFully")
  }



}
