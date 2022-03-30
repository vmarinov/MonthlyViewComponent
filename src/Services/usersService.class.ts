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
            image: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Walter_White_S5B.png/220px-Walter_White_S5B.png'
        },
        {
            userId: 3,
            name: 'Barbra Streisand',
            email: 'bstreisend@example.com',
            image: 'https://s3.amazonaws.com/cms.ipressroom.com/173/files/20219/61672a242cfac272344116ae_Barbra+Streisand/Barbra+Streisand_3380e497-e1c2-44b0-aa2e-a7eaf2b7d805-prv.jpg'
        }
    ]

    getUser(id: number) {
        return this.users.filter((user: any) => user.id = id);
    }

    getUsers(ids: any[]) {
        return this.users.filter((user: any) => ids.includes(user.id));
    }
}