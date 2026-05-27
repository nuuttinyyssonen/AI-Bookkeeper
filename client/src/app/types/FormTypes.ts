export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  email: string;
  password: string;
  passwordRepeat: string;
  firstName: string;
  lastName: string;
  phonenumber: string;
};

export type FormState<T> = {
  data?: T;
  error: string | null;
  success?: boolean;
};

export const initialState: FormState<LoginInput> = {
  data: undefined,
  error: null,
  success: false,
};

export const initialStateSignup: FormState<SignupInput> = {
  data: undefined,
  error: null,
  success: false
}