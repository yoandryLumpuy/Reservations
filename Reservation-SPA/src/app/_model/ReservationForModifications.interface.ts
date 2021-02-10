export interface ReservationForModifications{
    id : number;
    contactName: string;
    phone : string;
    birthDate : Date;
    contactTypeId : number;
    description: string;
}

export const defaultReservationForModifications = {
    id : 0,
    contactName: '',
    phone : '',
    birthDate : new Date(),
    contactTypeId : 0,
    description: ''
}