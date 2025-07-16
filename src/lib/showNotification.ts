import { toast } from "sonner";

export const showNotification = (title: string, body: string) => {
  console.log("🔔 showNotification called with:", title, body);

  if (!("Notification" in window)) {
    console.warn("🚫 Notification API not supported.");
    toast(`${title}: ${body}`);
    return;
  }

  if (Notification.permission !== "granted") {
    console.warn("🚫 Notification permission not granted.");
    toast(`${title}: ${body}`);
    return;
  }

  try {
    const n = new Notification(title, {
      body,
      icon: "/image/ani5.png",
    });

    n.onclick = () => {
      window.focus();
    };

    console.log("✅ Notification should show:", n);
  } catch (err) {
    console.error("❌ Notification error:", err);
    toast(`${title}: ${body}`);
  }
};
