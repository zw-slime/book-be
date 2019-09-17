import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all-user')
  getAllUser(@Req() req) {
    return this.usersService.findAll();
  }
}
