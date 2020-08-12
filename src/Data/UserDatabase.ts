import {BaseDatabase} from './BaseDatabase'
import {User} from '../Model/User'

export class UserDatabase extends BaseDatabase {
    protected tableName: string = "User"

    private toModel(dbModel?: any): User | undefined {
        return (
            dbModel &&
            new User(
                dbModel.id,
                dbModel.name,
                dbModel.nickname,
                dbModel.email,
                dbModel.password,
                dbModel.role
            )
        );
    }

    public async createUser(user: User): Promise<void> {
        await super.getConnection()
            .insert(user)
            .into(this.tableName)
    }

    public async getUserByEmailOrNickname(emailOrNickname: string): Promise<User | undefined> {
        const result = await this.getConnection()
            .select("*")
            .from(this.tableName)
            .where({email: emailOrNickname})

            if(!result[0]){
                const nickname = await this.getConnection()
                    .select("*")
                    .from(this.tableName)
                    .where({ nickname: emailOrNickname})

                return this.toModel(nickname[0])
            }

        return this.toModel(result[0])
    }
}