import React from 'react';
import './SupportPage.css';
import DarkMode from './DarkMode';


const SupportPage = () => {
  return (
    <div className='support-massage'>
      Tell me what help do you want?
      <DarkMode />
    </div>
  )
}

export default SupportPage

// import React, { useState, useEffect } from 'react';
// import './SupportPage.css';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import AuthContainer from './AuthContainer';
// import DarkMode from './DarkMode';

// // let navigate = useNavigate();




// function SupportPage() {
//   const [userInput, setUserInput] = useState('');
//   const [UserMassage, setUserMassage] = useState('');
//   const [botResponse, setBotResponse] = useState('');
//   const [showUserMassage, setShowUserMassage] = useState(false);
//   const [deviceName, setDeviceName] = useState('');
//   let navigate = useNavigate();
//   const [conversation, setConversation] = useState([]);
//   const userId = localStorage.getItem('userId');

//   console.log(userInput);


//   const getProductPrice = async (productName) => {

//     try {
//       const response = await axios.get(`http://localhost:5004/product/price?name=${productName}`);
//       const data = response.data.price;
//       return data;
//     } catch (error) {
//       console.error('Error fetching product price:', error);
//       return null;
//     }
//   };

//   const handleUserInput = (event) => {

//     setUserInput(event.target.value);
//   };

//   const getWeather = async () => {
//     try {
//       const response = await axios.get('http://localhost:5004/weather');
//       console.log(response);
//       return response.data.main.temp;
//     } catch (error) {
//       console.error('Error fetching weather information:', error);
//       return 'Sorry, unable to fetch weather information at the moment.';
//     }
//   };

//   const getNumber = async () => {

//     try {
//       const response = await axios.get(`http://localhost:5004/product/count?name=${deviceName}&userId=${userId}`);
//       const data = response.data;
//       return data;
//     } catch (error) {
//       console.error('Error fetching product price:', error);
//       return null;
//     }
//   }

//   const handleSendMessage = async () => {
//     setShowUserMassage(true);
//     if (userInput.toLowerCase().includes('hi')) {
//       setUserMassage(userInput);
//       addMessage(userInput, 'user');
//       addMessage('Hello, how can I help you?', 'bot');

//     } else if (userInput.toLowerCase().includes('price')) {
//       const productName = extractProductName(userInput);
//       setDeviceName(productName);
//       const productPrice = await getProductPrice(productName);
//       setUserMassage(userInput);
//       if (productPrice !== null) {
//         addMessage(`The price of ${productName} is $${productPrice}.`);
//       } else {
//         addMessage(`I'm sorry, I couldn't find the price of ${productName}.`);
//       }
//     } else if (userInput.toLowerCase().includes('weather')) {
//       setUserMassage(userInput);
//       const weatherInfo = await getWeather();
//       addMessage(`Today the temp. is ${Math.floor(weatherInfo)} degree Celsius`);
//     } else if (userInput.toLowerCase().includes('item') || userInput.toLowerCase().includes('cart')) {
//       setUserMassage(userInput);
//       if (userId !== null) {
//         const itemNumber = await getNumber();
//         addMessage(`There is ${itemNumber} ${deviceName} in the cart`);
//       }
//       else {
//         addMessage("Please use SignUp or Login");
//       }
//     }
//     else {
//       addMessage('I\'m sorry, I didn\'t understand that.');
//     }
//     setUserInput('');
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       handleSendMessage();
//     }
//   };

//   const extractProductName = (input) => {
//     console.log(input, "input");
//     const startIndex = input.toLowerCase().indexOf('price of') + 'price of'.length;
//     const endIndex = input.indexOf('?');
//     return input.substring(startIndex, endIndex).trim();  // Convert the query to lowercase for case-insensitive matching
//   };

//   const handleClick = () => {
//     navigate(-1);
//   };

//   const addMessage = (text, sender) => {
//     const newMessage = { text, sender, timestamp: new Date() };
//     setConversation([...conversation, newMessage]);
//   };

//   return (
//     <>
//       <div className="chat-container">
//         {showUserMassage && (
//           <div className="chat-messages">
//             <div className="user-message">
//               <p>{UserMassage}</p>
//             </div>
//             {botResponse && (
//               <div className="bot-message">
//                 <p>{botResponse}</p>
//               </div>
//             )}
//             <div className="user-message">
//               <p>{userInput}</p>
//             </div>
//           </div>
//         )}
//         <div className="user-input">
//           <input
//             type="text"
//             value={userInput}
//             onChange={handleUserInput}
//             placeholder="Tell me what help do you want?"
//             onKeyDown={handleKeyDown}
//           />
//           <button onClick={handleSendMessage}>
//             <img src={`/sent.png`} alt={userInput} />
//           </button>
//         </div>
//       </div>
//       <div>
//         <button type="button" className="Return-bottom" onClick={handleClick}>
//           Return to Shopping
//         </button>
//       </div>
//       <AuthContainer />
//       <DarkMode />
//     </>
//   );
// }

// export default SupportPage;
