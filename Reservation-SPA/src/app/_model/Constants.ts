export const PhonePattern: RegExp = /^\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
export const PhonePlaceHolder : string = "(###) ### ####";


export interface BannerStructure{
    leftText : string;
    middleText : string;
    navigationButtonText : string;
    emittedBy : any;
  }

export const defaultBannerStructure : BannerStructure = {
    leftText : '',
    middleText : '',
    navigationButtonText: '',
    emittedBy: null
  }

  export const NavigateToReservationList : string = 'Reservation List';
  export const NavigateToCreateReservation : string = 'Create Reservation';
