import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { BaseModule } from "./common/base/base.module";
import { AuthModuleController } from './module/auth-module/auth-module.controller';
import { AuthModuleMainService } from "./module/auth-module/auth-module-main.service";
import { AuthServiceService } from './service/auth-service/auth-service.service';
import { AuthService } from './service/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'ecommerce',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    BaseModule
  ],
  controllers: [AppController, AuthModuleController],
  providers: [AppService, AuthModuleMainService, AuthServiceService, AuthService],
})
export class AppModule {}
