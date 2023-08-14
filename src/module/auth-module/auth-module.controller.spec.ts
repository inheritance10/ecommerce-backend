import { Test, TestingModule } from '@nestjs/testing';
import { AuthModuleController } from './auth-module.controller';

describe('AuthModuleController', () => {
  let controller: AuthModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthModuleController],
    }).compile();

    controller = module.get<AuthModuleController>(AuthModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
