export interface User {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface ErrorResponse {
  message: string;
}
