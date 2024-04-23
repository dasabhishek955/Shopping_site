// ProductList.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ProductList.css';
import Navbar from './Navbar';
import Support from './Support';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import DarkMode from './DarkMode';



const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [addedToCart, setAddedToCart] = useState({});
  const categories = ['Mobile', 'Laptop'];
  const [popupMessage, setPopupMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let latestPage = 1;
  let productsPerScroll = 5; // Number of products to fetch per scroll
  const [productsShownInAPage, setProductsShownInAPage] = useState(0); // Number of products currently shown in the page
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const productContainerRef = useRef(null);
  const [favorites, setFavorites] = useState({}); // Object to store favorite status of each product
  const userId = localStorage.getItem('userId');
  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page')) || 1;
    latestPage = page;
    setCurrentPage(latestPage);
  }, [location]);

  useEffect(() => {
    fetchFavorites();
    fetchProducts(latestPage);
    setAddedToCart({});
  }, [category, latestPage]); // Fetch products whenever the category changes


  useEffect(() => {
    const handleScroll = () => {
      if (productsPerScroll < 10) {
        productsPerScroll = productsPerScroll + 5;
        fetchProducts(latestPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [products]);

  const fetchProducts = async (page) => {

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5004/products?category=${category}&page=${page}&limit=${productsPerScroll}`);
      const data = response.data;
      setProducts(data[0]);
      setTotalPages(data[1]);
      setProductsShownInAPage(prevProductsShownInAPage => prevProductsShownInAPage + productsPerScroll);
      const initialAddedToCart = {};
      data.forEach(product => {
        initialAddedToCart[product.id] = false; // Initialize as not added to cart
      });
      setAddedToCart(initialAddedToCart);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    const nextPage = Math.min(currentPage + 1, totalPages);
    if (nextPage !== currentPage) {
      setCurrentPage(nextPage);
      latestPage = nextPage;
      fetchProducts(latestPage);
      window.scrollTo(0, 0);
    }
    navigate(`${location.pathname}?category=${category}&page=${latestPage}`);
  };

  const handlePrevPage = () => {
    const prevPage = Math.max(currentPage - 1, 1);
    if (prevPage !== currentPage) {
      setCurrentPage(prevPage);
      latestPage = prevPage
      fetchProducts(latestPage);
      window.scrollTo(0, 0);
    }
    navigate(`${location.pathname}?category=${category}&page=${latestPage}`);
  };

  const handleFirstPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      latestPage = 1;
      fetchProducts(latestPage);
      window.scrollTo(0, 0);
    }
    navigate(`${location.pathname}?category=${category}&page=1`);
  };

  const handleLastPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(totalPages);
      latestPage = totalPages;
      fetchProducts(latestPage);
      window.scrollTo(0, 0);
    }
    navigate(`${location.pathname}?category=${category}&page=${latestPage}`);
  };


  const handleAddToCart = async (productId, productName, productPrice, productBrand) => {

    if (!userId) {
      setPopupMessage('Please sign in to use add to cart');
    }
    else {
      try {
        const response = await axios.post('http://localhost:5004/add-to-cart', {
          user_Id: userId,
          product_category: category,
          product_name: productName,
          product_price: productPrice,
          product_brand: productBrand,
          quantity: 1
        });
        setAddedToCart(prevState => ({
          ...prevState,
          [productId]: true
        }));
        setPopupMessage('Product added to cart!');
        setTimeout(() => {
          setPopupMessage('');
        }, 3000);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`http://localhost:5004/favorites?category=${category}&userId=${userId}`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      console.log(error);
    }
  };


  const toggleFavorite = async (productId, productName, productPrice, productBrand) => {

    if (!userId) {
      setPopupMessage('Please sign in to add to Favorite');
    }
    else {
      try {
        const response = await axios.post('http://localhost:5004/favorite', {
          user_Id: userId,
          product_Id: productId,
          product_category: category,
          product_name: productName,
          product_price: productPrice,
          product_brand: productBrand,
        });
        const { isFavorite } = response.data;
        let updatedFavorites = [];
        if (isFavorite) {
          updatedFavorites = [...favorites, productId];
        } else {
          updatedFavorites = favorites.filter(id => id !== productId);
        }
        setFavorites(updatedFavorites);
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    }
  };

  const handleMouseEnter = (product) => {
    setIsMagnifierVisible(true);
    setHoveredProduct(product);
  };

  const handleMouseLeave = () => {
    setIsMagnifierVisible(false);
    setHoveredProduct(null);
  };

  return (
    <>
      <div className="product-list" ref={productContainerRef}>
        <Navbar categories={categories} />
        <h2>{category} Products</h2>
        <ul>
          {products.map(product => (
            <li key={product.id} className="product-item">
              <div>
                <img src={`/${product.name}.jpg`} alt={product.name} onMouseEnter={() => handleMouseEnter(product)}
                  onMouseLeave={handleMouseLeave} />
              </div>
              <div className="product-details">
                {/* <a href={product.url} className="product-link" target="_blank" rel="noopener noreferrer"> */}
                <div className="product-name">{product.name}</div>
                {/* </a> */}
                <div className="product-price">Price: ${product.price}</div>
                <div className="product-brand">Brand: {product.brand}</div>
                <button className='add-to-cart' onClick={() => handleAddToCart(product.id, product.name, product.price, product.brand)} disabled={addedToCart[product.id]}>{addedToCart[product.id] ? 'Added to Cart' : 'Add to Cart'}</button>
                {userId && (
                  <button
                    className={`like-button ${Array.isArray(favorites) && favorites.includes(product.id)
                      ? 'like-button-red'
                      : 'like-button-white'
                      }`}
                    onClick={() => toggleFavorite(product.id, product.name, product.price, product.brand)}
                  >
                    &#9825; {/* Heart icon */}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {popupMessage && <div className="popup-message">{popupMessage}</div>}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={handleFirstPage} disabled={currentPage === 1}>&lt;&lt;</button>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>&lt;</button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>&gt;</button>
          <button onClick={handleLastPage} disabled={currentPage === totalPages}>&gt;&gt;</button>
        </div>
      )}
      <Support />
      <AuthContainer />
      <DarkMode />
    </>
  );
}
export default ProductList;
