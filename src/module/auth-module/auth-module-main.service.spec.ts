import { Test, TestingModule } from '@nestjs/testing';
import { AuthModuleMainService } from './auth-module-main.service';

describe('AuthModuleMainService', () => {
  let service: AuthModuleMainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthModuleMainService],
    }).compile();

    service = module.get<AuthModuleMainService>(AuthModuleMainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
