import { Body, Controller, Param, Get, UseGuards, UsePipes, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { VerifyAdminGuard } from 'src/guards/verify-admin.guard';
import { User } from './user.schema';
import { UpdateDto } from 'src/interfaces/user.interface';

@Controller('user')
export class UserController {
    constructor(private readonly userSerivce: UserService) { }

    @Get('get-user/:id')
    @UseGuards(VerifyAdminGuard)
    public async getSingleUser(@Param('id') id: string): Promise<SuccessHandler> {
        return await this.userSerivce.getSingleUser(id)
    }

    @Get('get-users')
    @UseGuards(VerifyAdminGuard)
    public async getUsers(): Promise<SuccessHandler<User[]>> {
        return await this.userSerivce.getUsers()
    }

    @Patch('update-user/:id')
    public async updateUser(@Body() updateDto: UpdateDto,
        @Param() {id}: {id:string}): Promise<SuccessHandler<User>> {
        return await this.userSerivce.updateUser(id, updateDto)
    }
}
