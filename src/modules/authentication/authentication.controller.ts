import { Body, Controller, Get, Post, UsePipes, Res, Req, NotFoundException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { HashPasswordPipe } from 'src/pipes/hash-password.pipe';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { Request, Response } from 'express';
import { User } from '../user/user.schema';
import { loginResponse, refreshTokenResponse } from 'src/interfaces/authentication.interface';
import { RegisterUserDto } from 'src/dto/auth/register-user.dto';
import { LoginUserDto } from 'src/dto/auth/login-user.dto';
@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) { }


    @Post('register-user')
    @UsePipes(HashPasswordPipe)
    async registerUser(@Body() registerDto: RegisterUserDto): Promise<SuccessHandler> {
        console.log(registerDto);
        return await this.authService.registerUser(registerDto)
    }

    @Post('login-user')
    async loginUser(
        @Body() LoginDto: LoginUserDto,
        @Res({ passthrough: true }) response: Response
    ): Promise<SuccessHandler<loginResponse>> {
        const loggedInUser = await this.authService.loginUser(LoginDto);
        const Options = {
            httpOnly: true,
            secure: true
        };
        response.cookie('accessToken', loggedInUser.data.tokens.accessToken, Options);
        response.cookie('refreshToken', loggedInUser.data.tokens.refreshToken, Options);

        return loggedInUser;
    }

    @Post('logout-user')
    public async logoutUser(@Body() { userId }: { userId: string }, @Res({ passthrough: true }) response: Response): Promise<SuccessHandler> {
        const responseFromService = await this.authService.logoutUser(userId);
        const Options = {
            httpOnly: true,
            secure: true,
        };
        if (responseFromService) {
            response.clearCookie('accessToken', Options);
            response.clearCookie('refreshToken', Options);
        }

        return responseFromService

    }

    @Get("refresh-token")
    public async refreshToken(@Req() request: Request,
        @Res({ passthrough: true }) response: Response): Promise<SuccessHandler<refreshTokenResponse>> {
        console.log("Entered" , request.cookies);
        const refreshTokenfromCookie = request.cookies['refreshToken'];
        console.log("Incoming Token", refreshTokenfromCookie);
        if (!refreshTokenfromCookie) {
            throw new NotFoundException("Token not found")
        }


        const newTokens = await this.authService.refreshToken(refreshTokenfromCookie)

        const { accessToken, refreshToken } = newTokens.data.tokens

        const Options = {
            httpOnly: true,
            secure: true
        }

        response.cookie('accessToken', accessToken, Options)
        response.cookie('refreshToken', refreshToken, Options)

        return newTokens


    }





}
