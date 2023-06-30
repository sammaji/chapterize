import { firestore } from "@/firebase/init";
import { doc, getDoc } from "firebase/firestore";

export async function isSubscriptionActive(uid: string) {
    const licenseRef = doc(firestore, "license", uid)
    const snapshot = await getDoc(licenseRef)

    if (snapshot.exists()) {
        const user = snapshot.data()
        const isSubscriptionActive = user.variantId && user.currentPeriodEnd && (Date.parse(user.currentPeriodEnd) + 86_400_00 > Date.now())
        return isSubscriptionActive
    }

    return false;
}

export async function isSubscriptionCancelled(uid: string) {
    const licenseRef = doc(firestore, "license", uid)
    const snapshot = await getDoc(licenseRef)

    if (!snapshot.exists()) {
        return false
    }

    const user = snapshot.data()
    const isSubscriptionCancelled = user.isSubscriptionCancelled
    return isSubscriptionCancelled
}