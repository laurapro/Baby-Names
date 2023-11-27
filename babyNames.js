export const Gender = {
  BOY: "boy",
  GIRL: "girl",
  NEUTRAL: "neutral",
};

export class BabyName {
  constructor(name, gender) {
    this.name = name;
    this.gender = gender;
    this.popularity = 0;
  }
}