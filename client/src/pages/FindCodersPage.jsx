import React, { useState, useEffect } from "react";
import axios from "axios";
// Ek UserCard component bhi banayenge code saaf rakhne ke liye
// import UserCard from '../components/UserCard';

const FindCodersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // Abhi ke liye skills hardcode kar rahe hain
  const availableSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "JavaScript",
    "Python",
  ];
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Jab bhi search ya filter badlega, yeh function chalega
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) {
          params.append("search", searchQuery);
        }
        if (selectedSkills.length > 0) {
          params.append("skills", selectedSkills.join(","));
        }

        const response = await axios.get(
          `http://localhost:5000/api/users?${params.toString()}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
        // Yahan error state bhi set kar sakte ho user ko dikhane ke liye
      } finally {
        setIsLoading(false);
      }
    };

    // Thoda delay add kar sakte ho (debounce) taaki har key press pe API call na ho
    const timerId = setTimeout(() => {
      fetchUsers();
    }, 500); // 500ms ke baad call karega

    return () => clearTimeout(timerId); // Cleanup function
  }, [searchQuery, selectedSkills]);

  const handleSkillChange = (skill) => {
    setSelectedSkills(
      (prevSkills) =>
        prevSkills.includes(skill)
          ? prevSkills.filter((s) => s !== skill) // Skill pehle se hai toh hata do
          : [...prevSkills, skill] // Nahi hai toh add kar do
    );
  };

  return (
    <div className="container">
      <h1>Find Coders</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <div className="skills-filter">
          {availableSkills.map((skill) => (
            <label key={skill}>
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
              />
              {skill}
            </label>
          ))}
        </div>
      </div>

      <div className="results">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="user-grid">
            {users.length > 0 ? (
              users.map((user) => (
                // Yahan ek UserCard component aayega
                <div key={user._id} className="user-card">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                  <p>Skills: {user.skills.join(", ")}</p>
                </div>
              ))
            ) : (
              <p>No coders found with these criteria.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindCodersPage;
