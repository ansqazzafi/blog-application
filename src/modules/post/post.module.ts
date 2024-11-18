import { Module , MiddlewareConsumer , RequestMethod} from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtMiddleware } from 'src/middlewares/auth.middleware';

@Module({
    imports:[],
    controllers:[PostController],
    providers:[PostService]
})
export class PostModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(JwtMiddleware)
          .forRoutes(
            { path: 'post/create-post', method: RequestMethod.POST }
          );
      }
}
