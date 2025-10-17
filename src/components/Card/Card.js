import React from 'react';
import styles from './Card.css';
import"../../colors.css";
import '../../assests/fonts.css';

const Card = ({ title, subtitle, image }) => {
  return (
    <div className={styles.card}>
      {image && <img src={image} alt="Card Icon" className={styles.image} />}
      <div className={styles.content}>
        <h2 className='card-title'>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default Card;
