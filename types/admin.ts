export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  date: string; // ISO string
  location?: string;
  description?: string;
}
