export interface User{
    id: number;
    userName : string;
    roles : Array<string>
}

export const defaultUser : User = {
    id: 0,
    userName: '',
    roles: new Array<string>()
}