import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { ResponseHandler } from 'src/utility/success-response';
import { JwtService } from '@nestjs/jwt';
@Module({
    imports:[
        MongooseModule.forFeature([{name:User.name , schema:UserSchema}])
    ],
    controllers:[UserController],
    providers:[UserService , ResponseHandler , JwtService]

})
export class UserModule {}
