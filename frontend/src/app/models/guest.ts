enum Attending {
  Yes,
  Maybe,
  No
}
export class Guest {
  id: number;
  firstname: string;
  lastname: string;
  attending: Attending;
  contact_phone: string;
  contact_email: string;
  plusOneOffered: boolean;
  plusOneNeeded: boolean;
  meal_choice: number;
  extra_info: string;
}
