export type User = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phonenumber: string;
    business_id: string;
    supabase_id?: string | null;
};
