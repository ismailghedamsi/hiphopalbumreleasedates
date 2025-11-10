import { styled } from "styled-components";

const sharedStyles = `
  border-radius: 999px;
  background: linear-gradient(135deg, #ffd666, #ffb347);
  border: none;
  color: #1f2933;
  font-weight: 600;
  letter-spacing: 0.01em;
  padding: 0.75rem 1.75rem;
  margin: 1rem 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 10rem;
  width: auto;
  max-width: 100%;
  text-align: center;
  box-shadow: 0 12px 24px rgba(255, 196, 86, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 32px rgba(255, 196, 86, 0.45);
    filter: brightness(1.05);
  }

  &:focus-visible {
    outline: 3px solid rgba(31, 41, 51, 0.3);
    outline-offset: 3px;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const AddReleaseButton = styled.button`
     ${sharedStyles}
`;

const LoginToUploadButton = styled.button`
     ${sharedStyles}
     background: linear-gradient(135deg, #00a881, #008464);
     color: #ffffff;
`;

const ExportButton = styled.button`
     ${sharedStyles}
     width: auto;
     padding: 0 2.5rem;
`;

export  {AddReleaseButton,LoginToUploadButton, ExportButton}