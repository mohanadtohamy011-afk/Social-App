import api from "./api";
import type { LoginSchemaType, RegisterSchemaType } from "../lib/schemas/Auth.schema";

export async function registerUser(formdata: RegisterSchemaType) {
  return api.post("/users/signup", formdata);
}

export async function LoginUser(formdata: LoginSchemaType) {
  return api.post("/users/signin", formdata);
}
