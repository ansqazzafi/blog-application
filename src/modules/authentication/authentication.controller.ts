import { Body, Controller , Get, Post, UsePipes , Res} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto, RegisterDto } from './authentication.dto';
import { HashPasswordPipe } from 'src/pipes/hash-password.pipe';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { Response } from 'express';
import { User } from '../user/user.schema';
@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authService:AuthenticationService){}


    @Post('register-user')
    @UsePipes(HashPasswordPipe)
    async registerUser(@Body() registerDto:RegisterDto):Promise<SuccessHandler>{
        console.log(registerDto); 
        return await this.authService.registerUser(registerDto)
        }

        @Post('login-user')
        async loginUser(
            @Body() LoginDto: LoginDto, 
            @Res({ passthrough: true }) response: Response
        ): Promise<SuccessHandler> {
            const loggedInUser = await this.authService.loginUser(LoginDto);
            console.log(loggedInUser.data.user);
            
            const Options = {
                httpOnly: true, 
                secure: true    
            };
            response.cookie('accessToken', loggedInUser.data.tokens.accessToken, Options);
            response.cookie('refreshToken', loggedInUser.data.tokens.refreshToken, Options);
    
            return loggedInUser;
        }
        

    
}
