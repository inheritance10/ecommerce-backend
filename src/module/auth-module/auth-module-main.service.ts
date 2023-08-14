import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import {User} from '../../entity/UserEntity'
import { Repository } from "typeorm";
@Injectable()
export class AuthModuleMainService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService
  ) {}

  async validateUser(body): Promise<User | null> {
    const user = await this.userRepository.findOne({body.email});



    if (user && user.password === password) {
      return user;
    }
    return null;
  }
}
