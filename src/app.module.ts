import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationController } from './modules/authentication/authentication.controller';
import { AuthenticationService } from './modules/authentication/authentication.service';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { PostController } from './modules/post/post.controller';
import { PostService } from './modules/post/post.service';
import { PostModule } from './modules/post/post.module';
import { LikeController } from './modules/like/like.controller';
import { LikeService } from './modules/like/like.service';
import { LikeModule } from './modules/like/like.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './modules/user/user.schema';
import { UserSchema } from './modules/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ResponseHandler } from './utility/success-response';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/BlogApp'),
    MongooseModule.forFeature([{name:User.name , schema:UserSchema}]),

    UserModule , AuthenticationModule , PostModule , LikeModule],
  controllers: [AppController, AuthenticationController, UserController, PostController, LikeController],
  providers: [AppService, AuthenticationService, UserService, PostService,LikeService  , JwtService , ResponseHandler],
})
export class AppModule {}
