import React from 'react';
import { useLeaf } from './LeafContext'; // Import the useLeaf hook
import './Header.css';
import "../../colors.css";

const Header = ({ profilePic, trunk = 54 }) => {
  const { leaf } = useLeaf(); // Access the leaf value from context

  return (
    <div className="Stylehead">
      <img className="pic2" src={process.env.PUBLIC_URL + '/Pics/alg.png'} alt="" />
      <span className="trunk">
        <img className="pic3" src={process.env.PUBLIC_URL + '/Pics/trunk.png'} alt="" />
        <div className="text-trunk">{trunk}</div>
      </span>
      <span className="leaf">
        <img className="pic3" src={process.env.PUBLIC_URL + '/Pics/leaf.png'} alt="" />
        <div className="text-leaf" style={{ fontSize: '20px' }}>{leaf}</div>
      </span>
      <div className="profile">
        {profilePic ? (
          <img className="profile-image" src={profilePic} alt="Profile" />
        ) : (
          <div className="profile-icon">
            <img />
          </div> // Example placeholder text/icon
        )}
      </div>
    </div>
  );
};

export default Header;
