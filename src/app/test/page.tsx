// "use client";

// import { useState } from "react";

// export default function TestNotification() {
//   const [loading, setLoading] = useState(false);

//   const sendNotification = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/sendNotification", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           token: "fLhwQYDiv0RSVCOfWjhorE:APA91bElxPXJT-WkI5I4m0Hu-Jq-U_JWQAdpClEP1ZG-Kj2_woUl1kwyhg2_b6FS12lVx_pfc3G_CaI9hSeeuXnikVejlfPmPH_3YkCFvdqWg1vj0K5QpncW",
//           title: "Test Notification",
//           message: "This is a test push notification.",
//           link: "https://your-app.com/chat/123",
//         }),
//       });

//       const data = await res.json();
//       console.log(data);
//       alert(data.message || "Notification sent!");
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <button
//         onClick={sendNotification}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//         disabled={loading}
//       >
//         {loading ? "Sending..." : "Send Notification"}
//       </button>
//     </div>
//   );
// }
