import React, { useState } from "react";
import styles from '../../styles/Carousel.module.css';
import ReleaseCard from "../ReleaseCard";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Center } from "@mantine/core";
import LazyLoad from "react-lazyload";


const Carousel = ({ cards }) => {

  const [currentAlbum, setCurrentAlbum] = useState(0);

  const handleNext = () => {
    setCurrentAlbum((prevState) => {
      return prevState + 1 < cards.length ? prevState + 1 : 0;
    });
  };

  const handlePrevious = () => {
    setCurrentAlbum((prevState) => {
      return prevState - 1 >= 0 ? prevState - 1 : cards.length - 1;
    });
  };


  return (
    <div>
    <div className={styles.container}>
       <button onClick={() => handlePrevious()} disabled={cards.length <= 0} className={styles.previous}>
        <ChevronLeft />
      </button>
      <LazyLoad height={200} offset={100}>
          <ReleaseCard fetching={false} index={currentAlbum} disabled={cards.length <= 0}  release={cards[currentAlbum]} releases={cards} />
      </LazyLoad>
       <button onClick={() => handleNext()} className={styles.next}>
        <ChevronRight />
      </button>
      
    </div>
     <Center>{currentAlbum + 1} / {cards.length}</Center>
    </div>
  )
};



export default Carousel;
