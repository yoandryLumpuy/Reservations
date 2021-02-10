import { User } from './user.interface';
import { ContactType } from './ContactType.interface';
export interface Contact {
    id : number;
    name: string;
    phone: number;
    birthDate: Date;
    contactType: ContactType;
    CreatedByUser: User;
}
