export class MenuChoice {
  starter: string;
  soup: string;
  main: string;
  dessert: string;

  constructor() {
    this.starter = null;
    this.soup = null;
    this.main = null;
    this.dessert = null;
  }

  allSelected() {
    return this.starter && this.soup && this.main && this.dessert;
  }
}
