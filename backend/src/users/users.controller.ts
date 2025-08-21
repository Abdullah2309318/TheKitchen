import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req) {
    // req.user is populated by the JwtStrategy from the Auth0 token
    const auth0Sub = req.user.sub;
    const username = req.user.nickname || 'default-user'; // Or another field from the token

    // This ensures a profile exists in your Supabase DB for the logged-in user
    return this.usersService.findOrCreateFromAuth0(auth0Sub, username);
  }
}