import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { ResponseHandler } from 'src/utility/success-response';
import { JwtService } from '@nestjs/jwt';
import { JwtMiddleware } from 'src/middlewares/auth.middleware';

@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name , schema:UserSchema}])
    ],
    controllers:[UserController],
    providers:[UserService , ResponseHandler , JwtService]

})
export class UserModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(JwtMiddleware)
          .forRoutes(
            { path: 'user/update-user', method: RequestMethod.PATCH }
          );
      }
}
