import React from 'react';
import '../assets/css/profile.css'; // Make sure to create this CSS file

export default function Profile() {
  // You can fetch real user data and put here later
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Passionate coder and typing enthusiast.",
    avatarUrl: "https://i.pravatar.cc/150?img=5"
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img className="profile-avatar" src={user.avatarUrl} alt="User avatar" />
        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-bio">{user.bio}</p>

        <button className="edit-profile-btn" onClick={() => alert('Edit Profile clicked')}>
          Edit Profile
        </button>
      </div>
    </div>
  );
}
