import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { uid, email } = await request.json();
    const responseBody = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: email,
            custom: { uid },
          },
          product_options: {
            receipt_button_text: "Activate Your License",
            receipt_thank_you_note:
              "Thank you for signing up! Click on the button to access your account.",
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMONSQUEEZY_STORE_ID as string,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: process.env.LEMONSQUEEZY_VARIANT_ID as string,
            },
          },
        },
      },
    };

    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      body: JSON.stringify(responseBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
    });

    const checkout_url = (await response.json()).data.attributes.url;
    return NextResponse.json({ checkout_url }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || err }, { status: 500 });
  }
}
