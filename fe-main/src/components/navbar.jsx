// File: src/components/navbar.jsx
import React from 'react';
import './navbar.css'; // Đảm bảo file này tồn tại

// Danh sách 17 chủ đề (tags) + "All" ở đầu
const topics = [
  "All",                          // index 0
  "Art & Photography",            // index 1
  "Biographies & Memoirs",        // index 2
  "Business & Economics",         // index 3
  "How-To & Self Help",           // index 4
  "Children's Books",             // index 5
  "Dictionaries",                 // index 6
  "Education & Teaching",         // index 7
  "Fiction & Literature",         // index 8
  "Magazines",                    // index 9
  "Medical & Health",             // index 10
  "Parenting & Relationships",    // index 11
  "Reference",                    // index 12
  "Science & Technology",         // index 13
  "History & Politics",           // index 14
  "Travel & Tourism",             // index 15
  "Cookbooks & Food",             // index 16
  "Other"                         // index 17
];

const Navbar = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <nav className="navbar-simple">
      <ul className="navbar-list">
        {topics.map((topic, idx) => (
          <li
            key={idx}
            className={`navbar-item ${selectedCategory === topic ? 'active' : ''}`}
            onClick={() => setSelectedCategory(topic)}
          >
            {topic}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
