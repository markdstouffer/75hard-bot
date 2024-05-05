import {createClient} from "@supabase/supabase-js";
import {configDotenv} from "dotenv";
import {Database} from "@internalTypes/database";
configDotenv();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_API_KEY);