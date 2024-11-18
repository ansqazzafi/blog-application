import { ForbiddenException, Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/user/user.schema';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.accessToken;
      console.log("Token from cookies in middle", token);


      if (!token) {
        throw new NotFoundException('Token not found');
      }

      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      console.log(decoded, "decs");


      const user = await this.userModel.findById(decoded.id)
        .select('-password -refreshToken');
      console.log("Userrrr", user);
      if (!user) {
        throw new ForbiddenException('User not found or token expired');
      }
      req.user = user
      console.log(req.user, "requestttttt");

      next();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }

      throw new ForbiddenException('Invalid or expired access token');
    }
  }
}
