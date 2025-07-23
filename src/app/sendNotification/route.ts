import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin"
import { Message } from "firebase-admin/messaging";



if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: process.env.FIREBASE_AUTH_URI,
      tokenUri: process.env.FIREBASE_TOKEN_URI,
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      clientC509CertUrl: process.env.FIREBASE_CLIENT_CERT_URL,
    } as admin.ServiceAccount),
  });
}


export async function POST(request:NextRequest){
    const {token, title,message,link}= await request.json();
    const payload: Message = {
        token,
        notification: {
          title: title,
          body: message,
        },
        webpush: {
          notification: {
            title: title,
            body: message,
            icon: "/image/ani5.png", // Make sure this icon exists in /public
            click_action: link, // optional: clicking the notification opens this
          },
          fcmOptions: {
            link, // this also opens link when notification is clicked
          },
        },
      };
      


    try{
        await admin.messaging().send(payload);
        return NextResponse.json({success:true, message:"Notification sent!"});
    }catch (error){
        return NextResponse.json({success:false, error});
    }
}


