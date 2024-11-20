import { Module , MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ResponseHandler } from 'src/utility/success-response';
import { JwtMiddleware } from 'src/middlewares/auth.middleware';
@Module({
    imports:[ MongooseModule.forFeature([{name:User.name , schema:UserSchema}])],
    controllers:[AuthenticationController],
    providers:[AuthenticationService  , JwtService , ResponseHandler]
})
export class AuthenticationModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(JwtMiddleware)
          .forRoutes(
            { path: 'authentication/logout-user', method: RequestMethod.POST },
          );
      }
}
