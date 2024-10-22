import { Role } from "./role";

export default interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userPassword: string;
  phone: string;
  rolId: number;
  role?: Role | null;
  status: boolean;
  copyWith?(user: User): User;
}
