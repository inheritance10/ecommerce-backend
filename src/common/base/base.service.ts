import { FindManyOptions, FindOneOptions, Repository } from 'typeorm'
import { IService } from 'src/common/base/iservice'
import { BadGatewayException, HttpException, Inject, Injectable } from '@nestjs/common'
import { BaseEntity } from 'src/common/base/base.entity'
import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder'
import { Brackets } from 'typeorm/query-builder/Brackets'
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere'
import { StatusTransitionEntity } from '../../entity/StatusTransition.entity'
import { FileEntity } from '../../entity/File.entity'
import { ClsService } from 'nestjs-cls'

@Injectable()
export class BaseService<T extends BaseEntity> implements IService<T> {
    @Inject(ClsService) private readonly clsService: ClsService

    constructor(private readonly genericRepository: Repository<T>) {}

    createQueryBuilder(alias: string): SelectQueryBuilder<T> {
        if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
            return this.genericRepository
                .createQueryBuilder(alias)
                .where(`${alias !== '' ? alias + '.' : ''}client_id = :clientId`, {
                    clientId: this.getAuthUserClientId(),
                })
        }
        return this.genericRepository.createQueryBuilder(alias)
    }

    selectBoxWithFullTextSearch(alias: string, search: string | null) {
        const qb = this.createQueryBuilder(alias)
        if (search) {
            const decodedSearch = decodeURI(search)
            let firstCondition = false
            qb.andWhere(
                new Brackets(subQuery => {
                    this.genericRepository.manager.connection
                        .getMetadata(this.genericRepository.target)
                        .columns.forEach((item, index) => {
                        if (
                            !['id', 'created_at', 'updated_at', 'client_id'].includes(
                                item.databaseNameWithoutPrefixes,
                            ) &&
                            item.type === 'varchar'
                        ) {
                            if (firstCondition === false) {
                                subQuery.where(
                                    'LOWER(' +
                                    alias +
                                    '.' +
                                    item.databaseNameWithoutPrefixes +
                                    ') like LOWER(:searchQuery)',
                                    { searchQuery: `%${decodedSearch}%` },
                                )
                                firstCondition = true
                            } else {
                                subQuery.orWhere(
                                    'LOWER(' +
                                    alias +
                                    '.' +
                                    item.databaseNameWithoutPrefixes +
                                    ') like LOWER(:searchQuery)',
                                    { searchQuery: `%${decodedSearch}%` },
                                )
                            }
                        }
                    })
                }),
            )
        }
        return qb
    }

    async create(entity: any): Promise<T> {
        let manipulatedEntity = entity
        if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
            if (Array.isArray(entity)) {
                manipulatedEntity = entity.map(item => {
                    item.clientId = this.getAuthUserClientId()
                    return item
                })
            } else {
                manipulatedEntity.clientId = this.getAuthUserClientId()
            }
        }
        try {
            return new Promise<T>((resolve, reject) => {
                this.genericRepository
                    .save(manipulatedEntity)
                    .then(created => resolve(created))
                    .catch(err => reject(err))
            })
        } catch (error) {
            throw new BadGatewayException(error)
        }
    }

    async update(id: number, entity: any): Promise<any> {
        let manipulatedEntity = entity
        if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
            manipulatedEntity.clientId = this.getAuthUserClientId()
        }
        try {
            const isExist = await this.findOneBy({ id: id } as FindOptionsWhere<T>)
            if (!isExist) {
                throw new HttpException('Not found', 404)
            }
            for (const key of Object.keys(manipulatedEntity)) {
                isExist[key] = manipulatedEntity[key]
            }
            return await this.genericRepository.save(isExist)
        } catch (error) {
            throw new BadGatewayException(error)
        }
    }

    getAll(): Promise<T[]> {
        try {
            if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
                // @ts-ignore
                return this.genericRepository.findBy({ clientId: this.getAuthUserClientId() })
            }
            return this.genericRepository.find()
        } catch (error) {
            throw new BadGatewayException(error)
        }
    }

    get(id: number): Promise<T> {
        let where: { id: number; clientId?: number } = { id: id }

        if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
            where = {
                ...where,
                clientId: this.getAuthUserClientId(),
            }
        }
        try {
            // @ts-ignore
            return <Promise<T>>this.genericRepository.findOneBy(where)
        } catch (error) {
            throw new BadGatewayException(error)
        }
    }

    async delete(id: number): Promise<T> {
        let where: any = { id: id }

        if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
            where = {
                ...where,
                clientId: this.getAuthUserClientId(),
            }
        }
        try {
            const isExist = await this.findOne({ where: where })
            if (isExist) {
                return this.genericRepository.remove(isExist)
            }
        } catch (error) {
            throw new BadGatewayException(error)
        }
    }

    async deleteWhere(where: FindOptionsWhere<T>): Promise<T[]> {
        try {
            if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
                where = {
                    ...where,
                    clientId: this.getAuthUserClientId(),
                }
                const isExist = await this.find({ where: where })
                if (isExist) {
                    return await this.genericRepository.remove(isExist)
                }
            }
        } catch (error) {
            throw new BadGatewayException(error)
        }
    }

    async find(options: FindManyOptions<T>): Promise<T[]> {
        if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
            const where = { ...options.where, clientId: this.getAuthUserClientId() }

            return await this.genericRepository.find({
                ...options,
                where: where,
            })
        }

        return this.genericRepository.find(options)
    }

    async findOne(options: FindOneOptions<T>): Promise<T> {
        if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
            const where = { ...options.where, clientId: this.getAuthUserClientId() }

            return await this.genericRepository.findOne({
                ...options,
                where: where,
            })
        }

        return this.genericRepository.findOne(options)
    }

    async findOneBy(where: FindOptionsWhere<T>): Promise<T> {
        if (this.isClientIdExist() && this.getAuthUserClientId() !== -1) {
            return await this.genericRepository.findOneBy({
                ...where,
                clientId: this.getAuthUserClientId(),
            })
        }

        return this.genericRepository.findOneBy(where)
    }

    appendLastStatusTransition(query, tableAlias, entityName, alias = 'lastStatusTransition') {
        return query
            .leftJoinAndMapMany(
                'lastStatus',
                qb =>
                    qb
                        .select()
                        .from(StatusTransitionEntity, 'lastStatus')
                        .where('lastStatus.transitionable_type = :type', { type: entityName })
                        .andWhere(
                            `lastStatus.id IN (SELECT MAX(st2.id) FROM status_transitions as st2 where st2.transitionable_type = '${entityName}' GROUP BY st2.transitionable_id)`,
                        ),
                'lastStatus',
                `"lastStatus"."transitionable_id" = ${tableAlias}.id`,
            )
            .leftJoinAndMapOne(
                `${tableAlias}.${alias}`,
                StatusTransitionEntity,
                alias,
                `${tableAlias}.id = ${alias}.transitionable_id and ${alias}.transitionable_type = '${entityName}' and "lastStatus"."id" = ${alias}.id`,
            )
            .leftJoinAndSelect(`${alias}.statusTo`, 'lastStatusTo')
            .leftJoinAndSelect(`${alias}.statusFrom`, 'lastStatusFrom')
            .leftJoinAndSelect(`${alias}.owner`, 'lastStatusOwner')
            .leftJoinAndSelect(`${alias}.toUser`, 'lastStatusToUser')
            .leftJoinAndMapMany(
                `${alias}.files`,
                FileEntity,
                'lastStatusFiles',
                `${alias}.id = lastStatusFiles.fileable_id and lastStatusFiles.fileable_type = 'StatusTransitionEntity'`,
            )
    }

    public getAuthUserClientId() {
        const request = this.clsService.get('userRequest');
        return request?.user ? request.user.clientId : -1
    }

    public getCurrentUserId() {
        const request = this.clsService.get('userRequest');
        return request?.user ? request.user.id : -1
    }

    public currentUserIsAdmin() {
        const request = this.clsService.get('userRequest');
        return request?.user ? request.user.isAdmin : false
    }

    private isClientIdExist() {
        return this.genericRepository.manager.connection
            .getMetadata(this.genericRepository.target)
            .columns.some(item => item.propertyName === 'clientId')
    }
}
