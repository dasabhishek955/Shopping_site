import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Favorites.css';
import DarkMode from './DarkMode';


const Favorites = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const userId = localStorage.getItem('userId');
  let navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteProducts();
  }, []);

  const fetchFavoriteProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5004/getFavorites?userId=${userId}`);
      setFavoriteProducts(response.data);
    } catch (error) {
      console.error('Error fetching favorite products:', error);
    }
  };
  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5004/favorites?itemId=${itemId}`, { data: { userId } });
      fetchFavoriteProducts();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };


  const handleNavigate = () => {
    navigate(-1);
  }

  return (
    <>
      <div className='favorite'>
        <h2>Favorite Products</h2>
        <ul>
          {favoriteProducts.map(item => (
            <li key={item.id} className="item-details">
              <div >
                <img src={`/${item.product_name}.jpg`} alt={item.product_name} />
              </div>
              <div className="item-description">
                <div className="item-name">{item.product_name}</div>
                <div className="item-category">Category: {item.category}</div>
                <div className="item-price">Price: {item.product_price}</div>
                <div className="item-brand">Brand: {item.product_brand}</div>
              </div>
              <div className="quantity-controls" >
                <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button type="button" className="countinue-botton" onClick={handleNavigate}>
          Add More Items
        </button>
      </div>
      <DarkMode/>
    </>
  );
};

export default Favorites;
