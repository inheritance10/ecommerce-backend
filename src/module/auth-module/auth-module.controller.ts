import { Controller, Post, UseGuards , Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthModuleMainService } from "./auth-module-main.service";

@Controller('auth-module')
export class AuthModuleController {
  constructor(private authService: AuthModuleMainService) {
  }
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.authService.validateUser(req)
  }
}
