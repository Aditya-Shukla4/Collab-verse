import React, { useState, useEffect } from "react";
import axios from "axios";

const FindCodersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const availableSkills = [
    "React",
    "Node.js",
    "MongoDB",
    "JavaScript",
    "Python",
  ];
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
          `http://localhost:5000/api/users?${params.toString()}`,
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery, selectedSkills]);

  const handleSkillChange = (skill) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill],
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
