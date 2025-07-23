// "use client";

// import { UploadButton } from "@uploadthing/react";
// import type { OurFileRouter } from "@/lib/uploadthing";
// import { db } from "@/lib/firebase";
// import { doc, updateDoc } from "firebase/firestore";
// import { useState } from "react";
// import { getAuth } from "firebase/auth";
// import Image from "next/image";

// export default function ProfilePictureUploader() {
//   const [imageUrl, setImageUrl] = useState<string | null>(null);
//   const user = getAuth().currentUser;

//   const handleUploadComplete = async (res: any) => {
//     const uploadedUrl = res?.[0]?.url;
//     if (!uploadedUrl || !user?.uid) return;

//     try {
//       const userDocRef = doc(db, "users", user.uid);
//       await updateDoc(userDocRef, { photoURL: uploadedUrl });
//       setImageUrl(uploadedUrl); // Show the new image
//       alert("✅ Profile picture updated!");
//     } catch (err) {
//       console.error("Error saving to Firestore:", err);
//       alert("⚠️ Failed to save to Firestore");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center gap-6 p-4 border rounded-xl bg-white shadow-md max-w-sm mx-auto">
//       <h2 className="text-lg font-semibold text-[#2F0147]">Upload Profile Picture</h2>

//       <UploadButton<OurFileRouter, "profilePictureUploader">
//         endpoint="profilePictureUploader"
//         onClientUploadComplete={handleUploadComplete}
//         onUploadError={(e) => alert(`Upload failed: ${e.message}`)}
//         appearance={{
//           button: "bg-[#F7717D] text-white px-4 py-2 rounded-lg hover:bg-[#DE639A] transition font-medium",
//           container: "border-2 border-dashed border-[#F7717D] p-4 rounded-lg",
//         }}
//       />

//       {imageUrl && (
//         <div className="mt-4">
//           <Image
//             src={imageUrl}
//             alt="Profile"
//             width={100}
//             height={100}
//             className="rounded-full object-cover ring-2 ring-[#F7717D]"
//           />
//         </div>
//       )}
//     </div>
//   );
// }
