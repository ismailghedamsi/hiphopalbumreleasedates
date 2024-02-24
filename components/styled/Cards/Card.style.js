// src/styled/CardStyles.js
import styled from 'styled-components';

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 320px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  word-wrap: break-word;
`;

export const CardImage = styled.img`
  width: 100%; // Responsive to the container width
  object-fit: cover; // Keeps the aspect ratio of the image
  margin-bottom: 20px; // Consistent margin below the image
`;

export const CardContent = styled.div`
  text-align: center;
`;

export const CardHeader = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  min-height: 48px; // Set a minimum height to accommodate a potential two-line wrap without changing the layout
`;

export const CardSecondaryText = styled.p`
  font-size: 14px;
  margin: 0;
  min-height: 36px; // Set a minimum height that allows for two lines of text
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

