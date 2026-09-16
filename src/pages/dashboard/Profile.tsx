import { useState } from "react";
import { Camera } from "lucide-react";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    role: "Project Manager",
    location: "Mumbai, India",
    bio: "Passionate about building great products and leading high-performing teams.",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    console.log("Profile update:", formData);
  };

  const handleAvatarUpload = () => {
    // TODO: Implement avatar upload
    console.log("Avatar upload");
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="clay-card p-6 max-w-2xl">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">A</span>
            </div>
            <button
              onClick={handleAvatarUpload}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold">{formData.name}</h2>
            <p className="text-muted-foreground">{formData.email}</p>
            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm rounded-full mt-1">
              {formData.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-bold mb-1.5 block">Name</label>
            <input
              type="text"
              className="clay-input w-full px-4 py-3 text-sm font-medium outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Email</label>
            <input
              type="email"
              className="clay-input w-full px-4 py-3 text-sm font-medium outline-none bg-muted"
              value={formData.email}
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Role</label>
            <input
              type="text"
              className="clay-input w-full px-4 py-3 text-sm font-medium outline-none bg-muted"
              value={formData.role}
              disabled
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Location</label>
            <input
              type="text"
              className="clay-input w-full px-4 py-3 text-sm font-medium outline-none"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block">Bio</label>
            <textarea
              className="clay-input w-full px-4 py-3 text-sm font-medium outline-none min-h-[100px]"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          <button type="submit" className="clay-button bg-primary text-primary-foreground px-6 py-3 font-bold">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
