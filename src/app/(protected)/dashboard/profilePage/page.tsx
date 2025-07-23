import ProfilePictureUploader from "../components/uploadProfilePicture";


export default function ProfilePage() {
  return (
    <div className="p-6 bg-black">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <ProfilePictureUploader />
    </div>
  );
}
