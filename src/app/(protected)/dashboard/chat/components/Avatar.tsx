interface AvatarProps {
  name?: string;
}
export default function Avatar({ name }: AvatarProps) {
  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm uppercase">
      {name ? name.charAt(0) : "?"}
    </div>
  );
} 