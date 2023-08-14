import { Module } from '@nestjs/common'
import { BaseService } from 'src/common/base/base.service'
import { Repository } from 'typeorm'

@Module({
    imports: [],
    controllers: [],
    exports: [BaseService, Repository],
    providers: [BaseService, Repository],
})
export class BaseModule {}
