export interface IService<T> {
    create(entity: any): Promise<T>

    update(id, entity: T): Promise<any>

    getAll(): Promise<T[]>

    get(id: number): Promise<T>

    delete(id: number): Promise<T>
}
