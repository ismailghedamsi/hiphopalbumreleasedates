import { styled } from "styled-components";

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; // Centers the items on the x-axis
  gap: 20px; // Manages the spacing between grid items
  margin: 0 auto; // Centers the grid container itself

  & > div { // Direct child divs will represent each card
    transition: transform 0.2s ease-in-out;
    
    &:hover {
      transform: scale(1.02); // Minor grow effect on hover
    }
  }
`;


export default Grid;