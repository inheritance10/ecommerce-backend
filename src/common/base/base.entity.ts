import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export class BaseEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
    public id: number

    @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
    public createdAt: Date

    @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at' })
    public updatedAt: Date
}
