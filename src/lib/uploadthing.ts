// // uploadthing.config.ts
// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { auth } from "@/lib/firebase"; // your firebase config

// const f = createUploadthing();

// export const ourFileRouter = {
//   profilePictureUploader: f({ image: { maxFileSize: "4MB" } })
//     .middleware(async () => {
//       const user = auth.currentUser;
//       if (!user) throw new Error("Unauthorized");

//       return { userId: user.uid };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       console.log("Upload complete", file.url);
//       // Optional: you can also update Firestore here
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;
