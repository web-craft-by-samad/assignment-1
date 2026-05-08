কেন any টাইপ থেকে unknown কেন বেটার চয়েস


TypeScript ব্যবহার করার মূল উদ্দেশ্যই হলো আমাদের কোডে টাইপ সেফটি নিশ্চিত করা। মানে হলো, কোড রান করার আগেই যদি কোনো সমস্যা থাকে, সেটা ধরে ফেলা। কিন্তু আমরা যখন API থেকে ডাটা নিই বা ইউজারের ইনপুট নিয়ে কাজ করি, তখন কিন্তু সবসময় জানা থাকে না কী ধরনের ডাটা আসবে। এই জায়গায় আসে any আর unknown। দুইটাই ব্যবহার করা যায় যখন আমরা জানি না কী টাইপের ডাটা আসবে। কিন্তু এদের মধ্যে অনেক পার্থক্য আছে।

any টাইপের সমস্যা কোথায়

any টাইপ হলো TypeScript এর একটা এস্কেপ রুট। মানে হলো, আপনি কম্পাইলারকে বলে দিচ্ছেন যে "ভাই, এই ভ্যারিয়েবলের টাইপ চেক করার দরকার নাই"। শুনতে সুবিধার মনে হলেও এটা আসলে অনেক বিপদজনক। দেখুন একটা উদাহরণ:

```typescript
function processData(data: any) {
  return data.toUpperCase();
}

processData("hello");
processData(42);
```

উপরের কোডে TypeScript কিন্তু কোনো এরর দেখাবে না। কিন্তু চিন্তা করেন, একটা নাম্বারের উপর toUpperCase কল করা হচ্ছে। এটা রান টাইমে গিয়ে ক্র্যাশ করবে। TypeScript এখানে মূলত বলছে "আমি টাইপ নিয়ে চিন্তা করবো না"। তাহলে TypeScript ব্যবহার করার মানেই বা কী?

any ব্যবহার করলে যে সমস্যাগুলো হয়:

১। কোড এডিটরে অটোকমপ্লিট পাবেন না। মানে আপনি জানবেন না কোন মেথড বা প্রপার্টি আছে।

২। কম্পাইল টাইমে কোনো টাইপ চেকিং হবে না। ভুল থাকলেও ধরা পড়বে না।

৪। এরর শুধু রান টাইমে দেখা যাবে। মানে প্রোডাকশনে গিয়ে ক্র্যাশ করতে পারে।

.৫। কোডবেসে ভাইরাসের মতো ছড়িয়ে যায়। একবার any ব্যবহার শুরু করলে সব জায়গায় করতে ইচ্ছা করে।

unknown টাইপ - একটা সেফ সলিউশন

unknown টাইপও any এর মতোই যেকোনো ধরনের ভ্যালু রাখতে পারে। কিন্তু এখানে একটা বড় পার্থক্য আছে। unknown ব্যবহার করলে TypeScript আপনাকে জোর করে টাইপ চেক করতে বলবে। দেখুন:

```typescript
function processData(data: unknown) {
  return data.toUpperCase();
}
```

এই কোড কম্পাইল হবে না। TypeScript এরর দেখাবে। কারণ unknown টাইপের উপর সরাসরি কোনো মেথড কল করা যায় না। আগে চেক করতে হবে যে এটা আসলে কী টাইপের। এটাই unknown এর সবচেয়ে বড় সুবিধা - নিরাপত্তা।

টাইপ ন্যারোয়িং - unknown ব্যবহারের চাবিকাঠি

টাইপ ন্যারোয়িং মানে হলো একটা ভ্যারিয়েবলের টাইপকে ধাপে ধাপে স্পেসিফিক করা। unknown ব্যবহার করতে হলে আপনাকে এই টাইপ ন্যারোয়িং করতেই হবে। চলুন দেখি কীভাবে করা যায়:

=> typeof দিয়ে চেক করা

```typescript
function processData(data: unknown): string {
  if (typeof data === "string") {
    return data.toUpperCase();
  }
  return "Not a string";
}
```

এখানে আমরা প্রথমে চেক করলাম data আসলে string কিনা। যদি string হয়, তাহলেই শুধু toUpperCase কল করলাম। এটা অনেক সেফ।

=> instanceof দিয়ে চেক করা

```typescript
function getLength(value: unknown): number {
  if (value instanceof Array) {
    return value.length;
  }
  return 0;
}
```

এখানে চেক করছি value একটা Array কিনা। Array হলেই শুধু length প্রপার্টি এক্সেস করছি।

=> নিজের মতো টাইপ গার্ড বানানো

```typescript
interface User {
  name: string;
  email: string;
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "email" in obj
  );
}

function greetUser(data: unknown): string {
  if (isUser(data)) {
    return `Hello, ${data.name}!`;
  }
  return "Hello, stranger!";
}
```

এটা একটু অ্যাডভান্সড। এখানে আমরা নিজেরাই একটা ফাংশন বানালাম যেটা চেক করে দেখে অবজেক্টটা User টাইপের কিনা। এরপর সেই ফাংশন ব্যবহার করে টাইপ ন্যারো করলাম।

=> সত্য-মিথ্যা চেক করা

```typescript
function printValue(value: unknown) {
  if (value) {
    console.log(value);
  }
}
```

এখানে আমরা চেক করছি value আছে কিনা, true কিনা।

=> সমান কিনা চেক করা

```typescript
function handleResponse(response: unknown) {
  if (response === null) {
    return "No data";
  }
  if (response === undefined) {
    return "Undefined response";
  }
}
```

এখানে চেক করছি response null বা undefined কিনা।

বাস্তব উদাহরণ - API রেসপন্স হ্যান্ডেল করা

চলুন দেখি একটা রিয়েল লাইফ এক্সাম্পল যেখানে unknown ব্যবহার করলে কতটা সুবিধা:

```typescript
async function fetchUserData(userId: number): Promise<unknown> {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
}

interface User {
  id: number;
  name: string;
  email: string;
}

function isValidUser(data: unknown): data is User {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof (data as User).id === "number" &&
    typeof (data as User).name === "string" &&
    typeof (data as User).email === "string"
  );
}

async function getUser(userId: number): Promise<User | null> {
  const data = await fetchUserData(userId);
  
  if (isValidUser(data)) {
    return data;
  }
  
  return null;
}
```

এখানে আমরা API থেকে ডাটা নিয়ে প্রথমে ভ্যালিডেট করছি। unknown ব্যবহার করার কারণে আমরা বাধ্য হচ্ছি চেক করতে। ফলে ভুল ডাটা আসলে রান টাইমে ক্র্যাশ হবে না।

কিছু গুরুত্বপূর্ণ টিপস

একদম জরুরি না হলে any ব্যবহার করবেন না। যখন টাইপ জানা নেই, তখন unknown ব্যবহার করুন।

unknown টাইপের কোনো কিছু ব্যবহার করার আগে অবশ্যই টাইপ চেক করুন। সরাসরি প্রপার্টি এক্সেস করবেন না।

যেসব টাইপ গার্ড বারবার দরকার হয়, সেগুলো আলাদা ফাংশন বানিয়ে রাখুন। পরে কাজে লাগবে।

TypeScript কনফিগে strictNullChecks চালু রাখুন। এটা অনেক এরর ধরতে সাহায্য করবে।

আপনার টাইপ গার্ড লজিক কেন ব্যবহার করছেন সেটা কমেন্টে লিখে রাখুন। পরে বুঝতে সুবিধা হবে।

শেষ কথা

any টাইপ ব্যবহার করা সহজ মনে হলেও এটা TypeScript এর পুরো উদ্দেশ্যকেই নষ্ট করে দেয়। unknown টাইপ আর টাইপ ন্যারোয়িং একসাথে ব্যবহার করলে আমরা নিরাপদ থাকতে পারি এবং একই সাথে ফ্লেক্সিবিলিটিও পাই। unknown ব্যবহার করলে কম্পাইল টাইমেই এরর ধরা পড়ে, যার ফলে আমাদের কোড আরো শক্তিশালী হয়।

মনে রাখবেন - any বলে "আমি টাইপ নিয়ে চিন্তা করি না", আর unknown বলে "আমি আগে টাইপ চেক করবো তারপর ব্যবহার করবো"। বুদ্ধিমানের কাজ হলো unknown বেছে নেওয়া।
