import {UserDatabase} from '../Data/UserDatabase'
import {HashManager} from '../Services/HashManager'
import {Authenticator} from '../Services/Authenticator'
import {IdGenerator} from '../Services/IdGenerator'
import {User, stringToUserRole, UserRole} from '../Model/User'
import {InvalidParameterError} from '../Errors/InvalidParameterError'
import {GenericError} from '../Errors/GenericError'
import {NotFoundError} from '../Errors/NotFoundError'

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private hashManager: HashManager,
        private authenticator: Authenticator,
        private idGenerator: IdGenerator
    ) {}

    public async signup(
        name: string,
        nickname: string,
        email: string,
        password: string,
        role: string
    ){
        if (!name || !email || !password || !role){
            throw new InvalidParameterError("Missing input")
        }

        if(email.indexOf("@") === -1){
            throw new InvalidParameterError("Invalid email")
        }

        if(role === "NORMAL" && password.length < 6){
            throw new InvalidParameterError("Password must contain at least 6 characters")
        }

        if(role === "ADMIN" && password.length < 10){
            throw new InvalidParameterError("Admin's password must contain at least 10 characters")
        }

        const id = this.idGenerator.generate()

        const hashPassword = await this.hashManager.hash(password)

        await this.userDatabase.createUser(
            new User(id, name, nickname, email, hashPassword, stringToUserRole(role))
        )

        const token = await this.authenticator.generateToken({id, role})

        return {token}
    }

    public async login(
        email: string,
        password: string
    ) {
        if(!email || !password){
            throw new InvalidParameterError("Missing input")
        }

        const user = await this.userDatabase.getUserByEmail(email)

        if(!user){
            throw new NotFoundError("User not found")
        }

        const isPasswordCorrect = await this.hashManager.compare(password, user.getPassword())

        if(!isPasswordCorrect){
            throw new InvalidParameterError("Invalid Password")
        }

        const accessToken = this.authenticator.generateToken({
            id: user.getId(),
            role: user.getRole()
        })

        return {accessToken}
    }
}