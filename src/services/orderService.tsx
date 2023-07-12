import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../config";

export const updateFeedback = async (id: string,rating:number, feedback: string|undefined ) => { 
    try {
        const docs = await updateDoc(doc(db,"Orders",id),{rating,feedback})
        //Firebase.firestore().collection("Orders").doc(id).update({rating,feedback})
        
        return "success"
    } catch (error) {
        console.log(error)
        return "error"
    }
}
