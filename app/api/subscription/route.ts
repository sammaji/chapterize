import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import getRawBody from "raw-body";
import { Readable } from "stream";
import crypto from "crypto";
import { cancelLicense, createOrUpdateLicense, updateLicense } from "@/firebase/firestore";

export async function POST(request: Request) {
    const body = await getRawBody(await Readable.from(await Buffer.from(await request.text())))
    const payload = JSON.parse(body.toString())

    const signature_string = headers().get('X-Signature')
    const signature_secret = process.env.LEMONSQUEEZY_SIGNATURE_SECRET as string
    const hmac = crypto.createHmac("sha256", signature_secret)
    const digest = Buffer.from(hmac.update(body).digest("hex"), "utf8")
    const signature = Buffer.from(Array.isArray(signature_string) ? signature_string.join(""): signature_string || "", "utf8")

    if (payload.data.attributes.product_id !== parseInt(process.env.LEMONSQUEEZY_PRODUCT_ID as string)) {
        return NextResponse.json({ message: "Invalid Product", payload: payload.data.attributes.product_id, local: process.env.LEMONSQUEEZY_PRODUCT_ID }, { status: 403 })
    }

    if (signature_secret !== signature_secret) {
        return NextResponse.json({ message: "Invalid Signature" }, { status: 403 })
    }

    const uid = payload.meta?.custom_data?.uid;
    if (!uid) {
        return NextResponse.json({ message: "No User ID Found" }, { status: 403 })
    }

    try {
        switch(payload.meta.event_name) {
            case "subscription_created":
                await createOrUpdateLicense(uid, {
                    subscriptionId: payload.data.id,
                    customerId: payload.data.attributes.customer_id,
                    variantId: payload.data.attributes.variant_id,
                    currentPeriodEnd: payload.data.attributes.renews_at,
                    isCancelled: false
                })
                return NextResponse.json({message: "Success"}, {status: 200})
            case "subscription_updated":
                await updateLicense(uid, {
                    variantId: payload.data.attributes.variant_id,
                    currentPeriodEnd: payload.data.attributes.renews_at 
                })
                return NextResponse.json({message: "Success"}, {status: 200})
            
            case "subscription_cancelled":
                await cancelLicense(uid, {
                    isCancelled: true
                })
                return NextResponse.json({message: "Success"}, {status: 200})
        }
    } catch (error: any) {
        return NextResponse.json({message: error.message || "Some Unknown Error occurred", body: error}, {status: 200})
    }
}