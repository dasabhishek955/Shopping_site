import React from 'react';
import { Link } from 'react-router-dom';


const CategoryCard = ({ title, link, onClickCategory }) => {

  const handleClick = () => {
    onClickCategory(title);
  };

  return (
    <Link to={link} className="category-link" onClick={handleClick} >
      <div className="category-card">
        <img src={`/${title}.png`} alt={title} />
      </div>
    </Link>
  );
}

export default CategoryCard;
