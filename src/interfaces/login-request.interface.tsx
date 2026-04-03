import { AuthClientContextInterface } from "@/interfaces/auth-client-context.interface";

export interface LoginRequestInterface {
  client?: AuthClientContextInterface;
  email: string;
  password: string;
}
