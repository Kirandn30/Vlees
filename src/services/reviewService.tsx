import { addDoc,collection } from "firebase/firestore";
import { db } from "../../config";


export interface Review {
    id: string|number[],
    feedback: string,
    userId: string|undefined,
}


export const addReview = async (review: Review) => {

    try {
        const docs = await addDoc(collection(db,"Reviews"), review)
        //Firebase.firestore().collection("Orders").doc(id).update({rating,feedback})
        return "success"
    } catch (error) {
        console.log(error)
        return "error"
    }
}