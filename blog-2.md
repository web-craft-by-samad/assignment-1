==> TypeScript এ জেনেরিক্স কীভাবে রিইউজেবল এবং টাইপ-সেফ কম্পোনেন্ট বানাতে সাহায্য করে



TypeScript এর সবচেয়ে শক্তিশালী ফিচারগুলোর একটা হলো জেনেরিক্স। এটা দিয়ে আমরা এমন কোড লিখতে পারি যেটা বিভিন্ন ধরনের ডাটা টাইপের সাথে কাজ করতে পারে, কিন্তু টাইপ সেফটি বজায় রাখে। মানে হলো, প্রতিটা টাইপের জন্য আলাদা আলাদা কোড লেখার দরকার নাই, আবার any ব্যবহার করেও টাইপ সেফটি হারাতে হবে না। জেনেরিক্স হলো এর পারফেক্ট সলিউশন।

জেনেরিক্স ছাড়া কী সমস্যা হয়

যদি একটা ফাংশন লিখতে হয় যেটা একটা অ্যারের প্রথম এলিমেন্ট রিটার্ন করবে। জেনেরিক্স ছাড়া প্রতিটা টাইপের জন্য আলাদা ফাংশন লিখতে হবে:

```typescript
function getFirstNumber(arr: number[]): number | undefined {
  return arr[0];
}

function getFirstString(arr: string[]): string | undefined {
  return arr[0];
}

function getFirstBoolean(arr: boolean[]): boolean | undefined {
  return arr[0];
}
```

এই পদ্ধতিতে অনেক সমস্যা আছে:

১। একই কোড বারবার লিখতে হচ্ছে। এটা DRY প্রিন্সিপালের বিরুদ্ধে।

২। মেইনটেইন করা কঠিন। একটা জায়গায় চেঞ্জ করলে সব জায়গায় করতে হবে।

৩। নতুন টাইপ আসলে আবার নতুন ফাংশন লিখতে হবে।

৪। কোডবেস অনেক বড় হয়ে যায়।

অথবা any ব্যবহার করলে:

```typescript
function getFirst(arr: any[]): any {
  return arr[0];
}
```

কিন্তু এতে টাইপ সেফটি চলে যায়। কোড এডিটরে সাজেশন পাবেন না, টাইপ চেকিং হবে না।

==> জেনেরিক্স দিয়ে সমাধান

জেনেরিক্স ব্যবহার করলে আমরা একটা প্লেসহোল্ডার টাইপ ব্যবহার করতে পারি :

```typescript
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNumber = getFirst([1, 2, 3]);
const firstString = getFirst(["a", "b", "c"]);
const firstBoolean = getFirst([true, false]);
```

এখানে T হলো একটা টাইপ প্যারামিটার। TypeScript নিজে থেকেই বুঝে নেয় কী টাইপ। তাই firstNumber হবে number, firstString হবে string। সব অটোমেটিক, কিন্তু পুরোপুরি টাইপ-সেফ।

চাইলে টাইপ স্পষ্ট করেও দেওয়া যাবে :

```typescript
const result = getFirst<number>([1, 2, 3]);
```

==> ইন্টারফেস এবং টাইপ এলিয়াসে জেনেরিক্স

শুধু ফাংশনেই না, ইন্টারফেস আর টাইপ এলিয়াসেও জেনেরিক্স ব্যবহার করা যায়:

```typescript
interface Response<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

const userResponse: Response<User> = {
  data: { id: 1, name: "John", email: "john@example.com" },
  status: 200,
  message: "Success"
};

const productResponse: Response<Product> = {
  data: { id: 101, title: "Laptop", price: 999 },
  status: 200,
  message: "Success"
};
```

একই Response ইন্টারফেস দুই জায়গায় ব্যবহার হলো। কিন্তু টাইপ সেফটি পুরোপুরি আছে।

==> class জেনেরিক্স ব্যবহার

class এ ও জেনেরিক্স ব্যবহার করে রিইউজেবল ডাটা স্ট্রাকচার বানানো যায়:

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
const num = numberStack.pop();

const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");
const str = stringStack.pop();
```

প্রতিটা Stack ইনস্ট্যান্স তার নিজের টাইপের জন্য স্ট্রিক্টলি টাইপড। numberStack এ শুধু নাম্বার যাবে, stringStack এ শুধু স্ট্রিং।

==> জেনেরিক কনস্ট্রেইন্ট

কখনো কখনো আমরা চাই যে জেনেরিক টাইপের কিছু নির্দিষ্ট প্রপার্টি থাকতেই হবে। এজন্য extends কিওয়ার্ড ব্যবহার করি:

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(item.length);
}

logLength("hello");
logLength([1, 2, 3]);
logLength({ length: 10 });
```

এখানে T extends HasLength মানে হলো T যেকোনো টাইপ হতে পারে, কিন্তু তার length প্রপার্টি থাকতেই হবে।

keyof দিয়ে কনস্ট্রেইন্ট

একটা খুব পাওয়ারফুল প্যাটার্ন হলো keyof ব্যবহার করা:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice", age: 25 };

const name = getProperty(user, "name");
const age = getProperty(user, "age");
```

এটা নিশ্চিত করে যে key অবশ্যই obj এর একটা প্রপার্টি। ভুল প্রপার্টি এক্সেস করলে কম্পাইল টাইম এরর দেখাবে।

বাস্তব উদাহরণ - জেনেরিক API সার্ভিস

==> চলুন দেখি একটা রিয়েল লাইফ এক্সাম্পল যেখানে জেনেরিক্স কীভাবে সাহায্য করে:

```typescript
class ApiService<T> {
  constructor(private baseUrl: string) {}

  async getAll(): Promise<T[]> {
    const response = await fetch(this.baseUrl);
    return response.json();
  }

  async getById(id: number): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    return response.json();
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return response.json();
  }

  async update(id: number, item: Partial<T>): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return response.json();
  }

  async delete(id: number): Promise<void> {
    await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
  }
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
}

const userService = new ApiService<User>('/api/users');
const postService = new ApiService<Post>('/api/posts');

const users = await userService.getAll();
const post = await postService.getById(1);
```

একটা ক্লাস দিয়ে সব ধরনের এন্টিটির জন্য API কল করা যাচ্ছে। আর সব জায়গায় ফুল টাইপ সেফটি।

একাধিক টাইপ প্যারামিটার

জেনেরিক্সে একাধিক টাইপ প্যারামিটার ব্যবহার করা যায়:

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const result = merge(
  { name: "Alice" },
  { age: 25, city: "NYC" }
);
```

ডিফল্ট টাইপ প্যারামিটার

জেনেরিক টাইপের জন্য ডিফল্ট ভ্যালু দেওয়া যায়:

```typescript
interface Container<T = string> {
  value: T;
}

const stringContainer: Container = { value: "hello" };
const numberContainer: Container<number> = { value: 42 };
```

জেনেরিক্স ব্যবহারের সুবিধা

১। টাইপ সেফটি পাওয়া যায়। কম্পাইল টাইমেই এরর ধরা পড়ে।

২। কোড রিইউজ করা যায়। একবার লিখলে যেকোনো টাইপের সাথে কাজ করবে।

৩। মেইনটেইন করা সহজ। এক জায়গায় আপডেট করলেই হয়।

৪। কোড এডিটরে অটোকমপ্লিট পাওয়া যায়। সব টাইপের জন্য সাজেশন আসে।

৫। কোডই ডকুমেন্টেশন হয়ে যায়। টাইপ দেখেই বুঝা যায় কী হচ্ছে।

৬। ফ্লেক্সিবিলিটি পাওয়া যায়। যেকোনো ডাটা স্ট্রাকচারের সাথে কাজ করা যায়।

৭। পারফরম্যান্সে কোনো প্রভাব নেই। সব চেকিং কম্পাইল টাইমে হয়।



টাইপ প্যারামিটারের নাম মানে বুঝার মতো হতে হবে। শুধু T না দিয়ে TData, TResponse এরকম ।

যখন দরকার তখনই কনস্ট্রেইন্ট ব্যবহার করা যাবে।

TypeScript কে নিজে টাইপ ইনফার করা যাবে যতটা সম্ভব। স্পষ্ট করে না দিলেও চলে।

সব জায়গায় জেনেরিক্স ব্যবহার করতে হবে না। যেখানে সত্যিই একাধিক টাইপের সাথে কাজ করতে হবে সেখানেই ব্যবহার করুন।

জটিল জেনেরিক্স হলে কমেন্ট করে রাখা উচিত।



জেনেরিক্স হলো TypeScript এ রিইউজেবল এবং টাইপ-সেফ কোড লেখার মূল চাবিকাঠি। এটা আমাদের কোড ডুপ্লিকেশন এবং টাইপ সেফটি - এই দুইটার মধ্যে একটা বেছে নেওয়ার ভুল চয়েস থেকে বাঁচায়। জেনেরিক্স ব্যবহার করে আমরা এমন কম্পোনেন্ট বানাতে পারি যেটা যেকোনো ডাটা টাইপের সাথে কাজ করে কিন্তু স্ট্রিক্ট টাইপিং বজায় রাখে।

যদি ইউটিলিটি ফাংশন বানাতে হয়, ডাটা স্ট্রাকচার, বা API সার্ভিস - সব জায়গাতেই জেনেরিক্স সাহায্য করবে। 

