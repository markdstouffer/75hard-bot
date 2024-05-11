import {supabase} from "@utils/supabase";
import {Function} from "@internalTypes/database";

export class ProgressService {

    public static weeklyUpdate = async (): Promise<void> => {

        const {error} = await supabase
            .rpc(Function.UpdateProgress);

        if (error)
            throw error;
    }

}