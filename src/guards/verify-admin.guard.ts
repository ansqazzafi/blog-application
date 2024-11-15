import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { TokenExpiredError } from 'jsonwebtoken';
  
  @Injectable()
  export class VerifyAdminGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = request.cookies['accessToken'];
  
      if (!token) {
        throw new ForbiddenException('Authorization token not provided');
      }
  
      try {
        const decoded = await this.jwtService.verifyAsync(token, {
          secret: process.env.ACCESS_TOKEN_KEY,
        });
        if (!decoded || decoded.isAdmin !==true) {
          console.log(decoded.isAdmin , "adsjfk");
          
          throw new ForbiddenException('Access restricted to admins');
        }
        request.user = decoded;
        return true;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException('Token has expired');
        }
        if(error instanceof ForbiddenException){
            throw error
        }
        throw new ForbiddenException('Access denied Only Admin can Perform this Action');
      }
    }
  }