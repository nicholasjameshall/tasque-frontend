export class TasqueDate {
  date: Date;

  constructor(date: Date) {
    this.date = date;
  };

  addDays(days: number): void {
    this.date.setDate(this.date.getDate() + days);
    return;
  }

  toString(): string {
    var mm = this.date.getMonth() + 1;
    var dd = this.date.getDate();

    return [
      this.date.getFullYear(),
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd
    ].join('-');
  }

  toDate(): Date {
    return this.date;
  }

}
