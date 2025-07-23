// // app/api/uploadthing/core.ts
// import { createUploadthing, type FileRouter } from "uploadthing/next";
// import { UTApi } from "uploadthing/server";

// const f = createUploadthing();

// export const ourFileRouter = {
//   profilePictureUploader: f({ image: { maxFileSize: "4MB" } })
//     .onUploadComplete(async ({ file, metadata }) => {
//       console.log("Upload complete:", file);
//     }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;
