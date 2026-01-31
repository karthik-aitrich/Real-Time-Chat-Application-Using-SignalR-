export interface User {
  userId?: string;
  userName: string;
  email: string;
  profilePhoto?: string | null;
  isOnline?: boolean;
}
