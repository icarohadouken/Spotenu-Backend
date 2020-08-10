export enum UserType {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export class User { 
    constructor(
        private id: string,
        private name: string,
        private nickname: string,
        private email: string,
        private password: string,
        private role: UserType
    ) {}

    getId(): string{
        return this.id
    }

    getName(): string{
        return this.name
    }

    getNickname(): string{
        return this.nickname
    }

    getEmail(): string{
        return this.email
    }

    getRole(): string{
        return this.role
    }
}