import React from 'react';
import './Translation.css';
import Title from './Title';
import"../../colors.css";
const Translation = () => {
    return (
        
      <div className='cards'>
        <Title title={"Translation"}/>
         <img className="pic" src={process.env.PUBLIC_URL + '/Pics/pic.png' }/>
        <Title title={"The text given"}/>
      </div>
      
    );
  };
  export default Translation;