import {BaseDatabase} from './BaseDatabase'
import {Band} from '../Model/Band'

export class BandDatabase extends BaseDatabase {
    protected tableName: string = "Band"

    private toModel(dbModel?: any): Band | undefined {
        return (
            dbModel &&
            new Band(
                dbModel.id,
                dbModel.name,
                dbModel.email,
                dbModel.nickname,
                dbModel.password,
                dbModel.authorization
            )
        );
    }

    public async createBand(band: Band): Promise<void> {
        await this.getConnection()
            .insert(band)
            .into(this.tableName)
    }

    public async getBands(): Promise<Band[]> {
        const result = await this.getConnection()
            .select('name', 'nickname', 'authorization')
            .from(this.tableName)

        return result
    }
}