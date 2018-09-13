enum Attending {
  Yes,
  Maybe,
  No
}
export class Guest {
  firstname: string;
  lastname: string;
  attending: Attending;
  phone_number: string;
  contact_email: string;
  plusOneOffered: boolean;
  plusOneNeeded: boolean;
}
