import { User } from './user.interface';
import { Contact } from './Contact.interface';

export interface Reservation {
    id: number;
    createdDateTime: Date;
    contact: Contact;
    createdByUser: User;
    youLikeIt: boolean;
    ranking: number
}
