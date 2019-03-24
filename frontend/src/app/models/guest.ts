export enum Attending {
  zero,
  Yes,
  Maybe,
  No
}
export class Guest {
  id: number;
  first_name: string;
  last_name: string;
  attending: Attending;
  contact_phone: string;
  contact_email: string;
  plus_one_offered: boolean;
  plus_one_needed: boolean;
  meal_choice: number;
  extra_info: string;
  attending_ceremony: boolean;
  guest: any;
}
