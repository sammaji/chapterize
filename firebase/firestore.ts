import { doc, setDoc } from "firebase/firestore";
import { firestore } from "./init";

export async function createOrUpdateLicense(uid: string, data: {subscriptionId: string, customerId: string, variantId: string, currentPeriodEnd: string}) {
    const licenseRef = doc(firestore, `license/${uid}`)
    try {
        await setDoc(licenseRef, data, {merge: true})
    } catch(error: any) {
        console.error(error.message || error)
    }
}

export async function updateLicense(uid: string, data: {variantId: string, currentPeriodEnd: string}) {
    const licenseRef = doc(firestore, `license/${uid}`)
    try {
        await setDoc(licenseRef, data, {merge: true})
    } catch(error: any) {
        console.error(error.message || error)
    }
}