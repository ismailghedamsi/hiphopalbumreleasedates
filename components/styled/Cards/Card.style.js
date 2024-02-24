// src/styled/CardStyles.js
import styled from 'styled-components';

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 320px; // Maintain a consistent width
  height: 500px; // Fixed height for all cards
  background-color: #fff; // Consider your theme's color
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  word-wrap: break-word;
  overflow: hidden;
`;

export const CardImage = styled.img`
  width: 100%;
  max-width: 280px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
`;

export const CardContent = styled.div`
  text-align: center;
`;

export const CardHeader = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #333;
  word-wrap: break-word;
`;

export const CardSecondaryText = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
  word-wrap: break-word;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; // Smooth transition for transform and shadow

  &:hover {
    transform: scale(1.03); // Slightly enlarges the card
    box-shadow: 0 4px 8px rgba(0,0,0,0.2); // Optionally, enhance the shadow for more depth
  }
`;

