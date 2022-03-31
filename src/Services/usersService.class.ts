import { Injectable } from "@angular/core";

@Injectable()
export class UsersService {
    users: any[] = [
        {
            userId: 1,
            name: 'John McClane',
            email: 'johnmcclane@example.com',
            image: 'https://upload.wikimedia.org/wikipedia/en/5/54/John_MacClane.jpg'
        },
        {
            userId: 2,
            name: 'Walter White',
            email: 'hisenberg@example.com',
            image: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Walter_White_S5B.png/220px-Walter_White_S5B.png',
        },
        {
            userId: 3,
            name: `Barbra Streisand`,
            email: 'bstreisend@example.com',
            image: undefined
        },
        {
            userId: 4,
            name: undefined,
            email: 'nameless.and.avatarless@example.com',
            image: undefined
        }
    ]

    getUser(id: number) {
        return this.users.filter((user: any) => user.userId == id);
    }

    getUsers(ids: any[]) {
        return this.users.filter((user: any) => ids.includes(user.userId));
    }
}