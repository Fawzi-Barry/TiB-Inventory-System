import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { apiRequest } from "../api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [roleMessage, setRoleMessage] = useState("");

  useEffect(() => {
    apiRequest("/auth/me")
      .then(setProfile)
      .catch((requestError) => setError(requestError.message));
  }, []);

  useEffect(() => {
    if (profile?.role === "Administrator") {
      apiRequest("/auth/users")
        .then(setUsers)
        .catch((requestError) => setRoleMessage(requestError.message));
    }
  }, [profile]);

  const changeRole = async (userId, role) => {
    setRoleMessage("");
    try {
      const updatedUser = await apiRequest(`/auth/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        ),
      );
      if (updatedUser._id === profile._id) {
        setProfile((currentProfile) => ({
          ...currentProfile,
          role: updatedUser.role,
        }));
      }
      setRoleMessage("Role updated successfully.");
    } catch (requestError) {
      setRoleMessage(requestError.message);
    }
  };

  if (error) {
    return (
      <main className="profile-page">
        <p className="error-message">{error}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <p className="profile-loading">Loading profile...</p>
      </main>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div>
          <p className="eyebrow">Account profile</p>
          <h1>{profile.name}</h1>
          <p className="profile-email">{profile.email}</p>
        </div>
      </section>
      <section className="profile-details">
        <div className="section-kicker">Your details</div>
        <dl>
          <div>
            <dt>Full name</dt>
            <dd>{profile.name}</dd>
          </div>
          <div>
            <dt>Email address</dt>
            <dd>{profile.email}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>
              <span className="role-badge">{profile.role || "Staff"}</span>
            </dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{new Date(profile.createdAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </section>
      {profile.role === "Administrator" && (
        <section className="profile-details user-management-section">
          <div className="section-kicker">User management</div>
          <p className="management-helper">
            Administrators can control who may manage accounts and inventory.
          </p>
          <div className="user-list">
            {users.map((user) => (
              <div className="user-row" key={user._id}>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <select
                  aria-label={`Role for ${user.name}`}
                  value={user.role || "Staff"}
                  onChange={(event) => changeRole(user._id, event.target.value)}
                >
                  <option value="Staff">Staff</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
            ))}
          </div>
          {roleMessage && (
            <p className="role-message" role="status">
              {roleMessage}
            </p>
          )}
        </section>
      )}
      <NavLink className="text-link" to="/products">
        Back to inventory <span>→</span>
      </NavLink>
    </main>
  );
}
