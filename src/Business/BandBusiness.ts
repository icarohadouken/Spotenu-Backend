import { BandDatabase } from '../Data/BandDatabase'
import { HashManager } from '../Services/HashManager'
import { Authenticator } from '../Services/Authenticator'
import { IdGenerator } from '../Services/IdGenerator'
import { Band } from '../Model/Band'
import { InvalidParameterError } from '../Errors/InvalidParameterError'
import { UnauthorizedError } from '../Errors/UnauthorizedError'
import { GenericError } from '../Errors/GenericError'
import { NotFoundError } from '../Errors/NotFoundError'
import {UserRole} from '../Model/User'

export class BandBusiness {
    constructor(
        private bandDatabase: BandDatabase,
        private hashManager: HashManager,
        private authenticator: Authenticator,
        private idGenerator: IdGenerator
    ) {}

    public async signup(
        name: string,
        nickname: string,
        description: string,
        password: string
    ) {
        if (!name || !nickname || !description || !password){
            throw new InvalidParameterError("Missing input")
        }

        if(password.length < 6){
            throw new InvalidParameterError("Password must contain at least 6 characters")
        }

        const id = this.idGenerator.generate()

        const hashPassword = await this.hashManager.hash(password)

        await this.bandDatabase.createBand(
            new Band(id, name, nickname, description, hashPassword, 0)
        )
    }

    public async getBands(token: string) {
        if(!token) {
            throw new UnauthorizedError("Missing access token")
        }

        const tokenData = this.authenticator.verifyToken(token)

        if(tokenData.role !== UserRole.ADMIN){
            throw new UnauthorizedError("You must be an admin to use this endpoint")
        }

        const result = await this.bandDatabase.getBands()

        return result
    }

    public async authorizeBand(token: string, bandId: string) {
        if (!token) {
            throw new UnauthorizedError("Missing access token")
        }

        const tokenData = this.authenticator.verifyToken(token)

        if (tokenData.role !== UserRole.ADMIN) {
            throw new UnauthorizedError("You must be an admin to use this endpoint")
        }

        const checkBand = await this.bandDatabase.getBandById(bandId)

        if(checkBand?.getAuthorization() === 1){
            throw new GenericError("Band already approved")
        }

        await this.bandDatabase.approveBand(bandId)
    }
}