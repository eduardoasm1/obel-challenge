export interface User {
  id: string;
  email: string;
  name?: string | null;
  roleIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
