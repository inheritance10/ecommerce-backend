import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { BaseService } from 'src/common/base/base.service'
import { BaseEntity } from 'src/common/base/base.entity'

export class BaseController<T extends BaseEntity> {
    protected constructor(private readonly baseService: BaseService<T>) {}

    @Get()
    async getAll(): Promise<T[]> {
        return this.baseService.getAll()
    }

    @Get(':id')
    async get(@Param('id') id: number): Promise<T> {
        return this.baseService.get(id)
    }

    @Post()
    async create(@Body() entity: T): Promise<T> {
        return this.baseService.create(entity)
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.baseService.delete(id)
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() entity: T): Promise<T> {
        return this.baseService.update(id, entity)
    }
}
