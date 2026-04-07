import { User } from '@/interfaces/user.interface';

export interface ListUsersResponseInterface {
  data: User[];
  metadata?: {
    pagination?: unknown;
  };
}
