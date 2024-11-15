import { Body, Controller , Param , Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { VerifyAdminGuard } from 'src/guards/verify-admin.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userSerivce: UserService){}

    @Get('get-user/:id')
    @UseGuards(VerifyAdminGuard)
    public async getSingleUser(@Param('id') id: string):Promise<SuccessHandler>{
        return await this.userSerivce.getSingleUser(id)
        
    }
}
