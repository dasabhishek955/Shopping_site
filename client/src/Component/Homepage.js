import React, { useState } from 'react';
import './Homepage.css';
import CategoryCard from './CategoryCard';
import ProductList from './ProductList';
import Support from './Support';
import AuthContainer from './AuthContainer';
import DarkMode from './DarkMode';


const Homepage = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
    };

    return (
        <>
            <div className="homepage">
                <AuthContainer />
                <h2>Categories</h2>
                <div className="category-list">
                    <CategoryCard title="Mobile" link="/mobile" onClickCategory={handleCategoryClick} />
                    <CategoryCard title="Laptops" link="/laptop" onClickCategory={handleCategoryClick} />
                </div>
                {selectedCategory && <ProductList category={selectedCategory} />}
            </div>
            <Support />
            <DarkMode />
        </>
    );
}


export default Homepage;
