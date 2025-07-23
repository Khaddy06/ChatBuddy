import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin"
import { Message } from "firebase-admin/messaging";



if(!admin.apps.length){
    const ServiceAccount = `require("@/service_key.json")`;
    admin.initializeApp({
        credential:admin.credential.cert(ServiceAccount),
    })
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


