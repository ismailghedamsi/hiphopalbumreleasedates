import React, { useState } from "react";
import styles from '../../styles/Carousel.module.css';
import ReleaseCard from "../ReleaseCard";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Center } from "@mantine/core";


const Carousel = ({ cards }) => {
  console.log("cards ", cards)

  const [currentAlbum, setCurrentAlbum] = useState(0);

  const handleNext = () => {
    setCurrentAlbum((prevState) => {
      console.log("aaaa");
      return prevState + 1 < cards.length ? prevState + 1 : 0;
    });
    console.log("current album infd ", cards[currentAlbum]);
  };

  const handlePrevious = () => {
    setCurrentAlbum((prevState) => {
      console.log("aaaa");
      return prevState - 1 >= 0 ? prevState - 1 : cards.length - 1;
    });
    console.log("current album infd ", cards[currentAlbum]);
  };


  return (
    <div>
    <div className={styles.container}>
       <button onClick={() => handlePrevious()} disabled={cards.length <= 0} className={styles.previous}>
        <ChevronLeft />
      </button>
      
      <ReleaseCard fetching={false} index={currentAlbum} disabled={cards.length <= 0}  release={cards[currentAlbum]} releases={cards} />
       <button onClick={() => handleNext()} className={styles.next}>
        <ChevronRight />
      </button>
      
    </div>
     <Center>{currentAlbum + 1} / {cards.length}</Center>
    </div>
  )
};



export default Carousel;
