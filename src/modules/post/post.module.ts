import { Module , MiddlewareConsumer , RequestMethod} from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtMiddleware } from 'src/middlewares/auth.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.schema';
import { User, UserSchema } from '../user/user.schema';
import { ResponseHandler } from 'src/utility/success-response';
import { JwtService } from '@nestjs/jwt';
User
@Module({
    imports:[
      MongooseModule.forFeature([{name:Post.name , schema:PostSchema}]),
      MongooseModule.forFeature([{name:User.name , schema:UserSchema}])
    ],
    controllers:[PostController],
    providers:[PostService , ResponseHandler , JwtService]
})
export class PostModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(JwtMiddleware)
          .forRoutes(
            { path: 'post/create-post', method: RequestMethod.POST },
            { path: 'post/delete-post/:postId', method: RequestMethod.DELETE },
            { path: 'post/update-post/:postId', method: RequestMethod.PATCH },
          );
      }
}
