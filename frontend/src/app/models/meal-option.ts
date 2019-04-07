export class MealOption {
  index: number;
  name: string;
  imageUrl: string;

  constructor(index: number, name: string, imageUrl: string) {
    this.index = index;
    this.name = name;
    this.imageUrl = imageUrl;
  }
}
