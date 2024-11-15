import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
import { UserDocument } from '../user/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './authentication.dto';
import { ResponseHandler } from 'src/utility/success-response';
import { SuccessHandler } from 'src/interfaces/response.interface';
import * as bcrypt from 'bcrypt'
import { loginResponse, refreshTokenResponse } from 'src/interfaces/authentication.interface';
import { Types } from 'mongoose';
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly responseHandler: ResponseHandler
  ) { }


  public removeFields(obj: any, fields: string[]): any {
    const removedFields = { ...obj };
    fields.forEach(field => delete removedFields[field]);
    return removedFields;
  }



  private async generateAccessToken(user): Promise<string> {
    const payload = {
      id: user._id,
      username:user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status:user.status,
      bio:user.bio,
      isAdmin: user.isAdmin,
      address:user.address,
      posts:user.posts
    };
    const secretKey = process.env.ACCESS_TOKEN_KEY;

    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY || '30s';
    return this.jwtService.signAsync(payload, { secret: secretKey, expiresIn });
  }

  private async generateRefreshToken(user): Promise<string> {
    const payload = { id: user._id };
    const secretKey = process.env.REFRESH_TOKEN_KEY;
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY || '30d';
    return this.jwtService.signAsync(payload, { secret: secretKey, expiresIn });
  }


  async registerUser(RegisterDto: RegisterDto): Promise<SuccessHandler> {
    const existingUser = await this.userModel.findOne({ email: RegisterDto.email })
    if (existingUser) {
      throw new ConflictException("User already Exist with this Email");
    }
    const registeredUser = new this.userModel({ ...RegisterDto })
    await registeredUser.save()
    return this.responseHandler.successHandler(null, "User registered Succesfully")
  }

  async loginUser(LoginDto: LoginDto): Promise<SuccessHandler<loginResponse>> {
    const user = await this.userModel.findOne({    $or: [{username:LoginDto.username}, {email:LoginDto.email}] })
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(LoginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }


    const accessToken = await this.generateAccessToken(user)
    const refreshToken = await this.generateRefreshToken(user)
    if (!accessToken || !refreshToken) {
      throw new ConflictException("Tokens are not Generated")
    }

    user.refreshToken = refreshToken
    await user.save()
    const newUser = user.toObject()
    const userWithoutSensitiveData = this.removeFields(newUser, ['password', 'refreshToken', '__v', 'createdAt', 'updatedAt'])
    const loggedInUser: loginResponse = {
      user: userWithoutSensitiveData,
      tokens: {
        accessToken,
        refreshToken
      }

    }
    return this.responseHandler.successHandler(loggedInUser, "User loggedIn SuccessFully")
  }


  async logoutUser(userId: string): Promise<SuccessHandler> {
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $unset: { refreshToken: 1 }
      },
      { new: true }
    )

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return this.responseHandler.successHandler(null, "User loggedOut Succesfully")
  }


  async refreshToken(incomingRefreshToken: string): Promise<SuccessHandler<refreshTokenResponse>> {

    const decodedToken = await this.jwtService.verifyAsync(incomingRefreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    const user = await this.userModel.findById(decodedToken.id);
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = await this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);
    if (!accessToken || !newRefreshToken) {
      throw new ForbiddenException('there is an issue with tokens');
    }
    user.refreshToken = newRefreshToken;
    await user.save();

    const newTokens = {
      tokens:{
        accessToken,
        refreshToken:newRefreshToken
      }
    }

    return this.responseHandler.successHandler( newTokens,"Tokens refreshed Sucessfully")
  }





}
