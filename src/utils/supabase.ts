import {createClient} from "@supabase/supabase-js";
import {configDotenv} from "dotenv";
configDotenv();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);