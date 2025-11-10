import Link from "next/link";
import styled, { css } from "styled-components";

export const NavbarContainer = styled.nav`
  width: 100%;
  height: ${(props) => (props.extendNavbar ? "40vh" : "80px")};
  background-color: black;
  display: flex;
  flex-direction: column;
  margin-bottom: 5vh;
  @media (min-width: 700px) {
    height: 80px;
  }
`;

export const LeftContainer = styled.div`
  flex: 70%;
  display: flex;
  align-items: center;
  padding-left: 5%;
`;

export const RightContainer = styled.div`
  flex: 30%;
  display: flex;
  justify-content: flex-end;
  padding-right: 50px;
`;

export const NavbarInnerContainer = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
`;

export const NavbarLinkContainer = styled.div`
  display: flex;
`;

export const NavbarLink = styled(Link)`
  color: white;
  font-size: x-large;
  font-family: Arial, Helvetica, sans-serif;
  text-decoration: none;
  margin: 10px;

  &.active {
    color: "red";
  }
  
  @media (max-width: 700px) {
    display: none;
  }
`;

export const NavbarLinkExtended = styled(Link)`
  color: white;
  font-size: x-large;
  font-family: Arial, Helvetica, sans-serif;
  text-decoration: none;
  margin: 10px;
`;

export const Logo = styled.img`
  margin: 10px;
  max-width: 180px;
  height: auto;
`;

export const OpenLinksButton = styled.button`
  width: 70px;
  height: 50px;
  background: none;
  border: none;
  color: white;
  font-size: 45px;
  cursor: pointer;
  @media (min-width: 700px) {
    display: none;
  }
`;

export const NavbarExtendedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 700px) {
    display: none;
  }
`;

const sharedSearchInput = css`
  background-color: #111;
  border: 1px solid #2d2d2d;
  border-radius: 999px;
  color: #f5f5f5;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  font-size: 0.95rem;
  line-height: 1.2;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: #9d9d9d;
  }

  &:focus {
    outline: none;
    border-color: #00a881;
    box-shadow: 0 0 0 2px rgba(0, 168, 129, 0.2);
  }
`;

export const HeaderSearchWrapper = styled.div`
  display: none;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-right: 5%;

  @media (min-width: 900px) {
    display: flex;
  }
`;

export const HeaderSearchForm = styled.form`
  position: relative;
  display: flex;
  align-items: center;
`;

export const HeaderSearchInput = styled.input`
  ${sharedSearchInput};
  width: 240px;
`;

export const HeaderSearchIcon = styled.span`
  position: absolute;
  right: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  color: #9d9d9d;
  pointer-events: none;
`;

export const MobileSearchContainer = styled.div`
  width: 100%;
  padding: 0 1.5rem;
  margin-top: 1rem;
`;

export const MobileSearchForm = styled.form`
  position: relative;
  width: 100%;
`;

export const MobileSearchInput = styled.input`
  ${sharedSearchInput};
  width: 100%;
`;

export const MobileSearchIcon = styled.span`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9d9d9d;
  pointer-events: none;
`;