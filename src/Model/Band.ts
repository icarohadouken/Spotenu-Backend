export class Band {
    constructor(
        private id: string,
        private name: string,
        private nickname: string,
        private description: string,
        private password: string,
        private authorization: boolean
    ) {}

    public getId(): string{
        return this.id
    }

    private getName(): string{
        return this.name
    }

    private getNickname(): string{
        return this.nickname
    }

    private getDescription(): string{
        return this.description
    }

    private getPassword(): string{
        return this.password
    }

    private getAuthorization(): boolean{
        return this.authorization
    }
}