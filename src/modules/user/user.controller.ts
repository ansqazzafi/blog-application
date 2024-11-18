import { Body, Controller, Param, Get, UseGuards, UsePipes, Patch, Delete, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { SuccessHandler } from 'src/interfaces/response.interface';
import { VerifyAdminGuard } from 'src/guards/verify-admin.guard';
import { User } from './user.schema';
import { UpdateUserDto } from 'src/dto/user/update-user.dto';
import { Request } from 'express';
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

    @Patch('update-user')
    public async updateUser(@Body() updateDto: UpdateUserDto,
        @Req() req: Request,): Promise<SuccessHandler<User>> {
        const user = req.user
        return await this.userSerivce.updateUser(user.id, updateDto)
    }

    @Delete('delete-user/:id')
    @UseGuards(VerifyAdminGuard)
    public async deleteUser(@Param() { id }: { id: string }): Promise<SuccessHandler<User>> {
        return await this.userSerivce.deleteUser(id)
    }



}
