export function filterEvenNumbers(numbers: number[]): number[] {
  return numbers.filter(num => num % 2 === 0);
}

export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

export type StringOrNumber = string | number;

export function checkType(input: StringOrNumber): "String" | "Number" {
  if (typeof input === "string") {
    return "String";
  }
  return "Number";
}

export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

export interface Book {
  title: string;
  author: string;
  publishedYear: number;
}

export interface BookWithStatus extends Book {
  isRead: boolean;
}

export function toggleReadStatus(book: Book): BookWithStatus {
  return {
    ...book,
    isRead: true
  };
}

export class Person {
  constructor(public name: string, public age: number) {}
}

export class Student extends Person {
  constructor(name: string, age: number, public grade: string) {
    super(name, age);
  }

  getDetails(): string {
    return `Name: ${this.name}, Age: ${this.age}, Grade: ${this.grade}`;
  }
}

export function getIntersection(arr1: number[], arr2: number[]): number[] {
  return arr1.filter(num => arr2.includes(num));
}
