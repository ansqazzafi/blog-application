import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserDocument } from '../user/user.schema';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { ResponseHandler } from 'src/utility/success-response';
NotFoundException
@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument> , 
    private readonly responseHandler:ResponseHandler
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
      return this.responseHandler.successHandler(user , `User ${user.firstName} are get successfully`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred while fetching the user.');
      }
    }
  }



}
