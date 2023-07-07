import { Firebase } from "../../config";

export const updateFeedback = async (id: string,rating:number, feedback: string|null ) => { 
    try {
        const doc = await Firebase.firestore().collection("Orders").doc(id).update({rating,feedback})
        
        return "success"
    } catch (error) {
        console.log(error)
        return "error"
    }
}
