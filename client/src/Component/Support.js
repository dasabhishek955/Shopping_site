import React from 'react';
import './Support.css';
import { useNavigate } from 'react-router-dom'


const Support = () => {
  let navigate = useNavigate();

  const handleSupportClick = () => {
    navigate("/support");
  };

  return (
    <div className="support" onClick={handleSupportClick}>
      <img src={`/support.png`} alt={"support"} />
    </div>
  );
}

export default Support;
