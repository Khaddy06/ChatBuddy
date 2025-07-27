// lib/showNotification.ts
export function showNotification({
  title,
  body,
  icon = "/image/ani5.png",
}: {
  title: string;
  body: string;
  icon?: string;
}) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon,
    });
  }
}
