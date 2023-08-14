import { Module } from '@nestjs/common';
import { AuthModuleMainService } from './auth-module/auth-module-main.service';
import { AuthModuleController } from './auth-module/auth-module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from '../entity/UserEntity'
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./auth-module/strategies/local.strategy";
import { AuthServiceService } from './service/auth-service/auth-service.service';


@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule],
  providers: [AuthModuleMainService, LocalStrategy, AuthServiceService],
  controllers: [AuthModuleController],
})
export class AuthModule {

}
