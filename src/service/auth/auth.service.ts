import { Injectable } from '@nestjs/common';
import { BaseService } from "../../common/base/base.service";
import { User } from "../../entity/UserEntity";

@Injectable()
export class AuthService extends BaseService<User>{

}
