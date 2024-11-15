import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                "/api/users/profile",
                { name, avatar },
                { withCredentials: true }
            );
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Error updating profile");
        }
    };

    return (
        <div>
            <h2>User Profile</h2>
            <form onSubmit={handleProfileUpdate}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Avatar URL</label>
                    <input
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
