import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all-user')
  getAllUser(@Req() req) {
    return this.usersService.findAll();
  }
}
