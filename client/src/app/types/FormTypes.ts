export type LoginInput = {
  email: string;
  password: string;
};

// export type SignupInput = {}

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