import Link from "next/link";
import { styled } from "styled-components";

const Tabs = styled.div`
  display: flex;
  overflow-x: auto;
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
`;

const Tab = styled(Link)`
    color: #333;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px 5px 0 0;
  transition: background-color 0.3s ease-in-out;
  flex-shrink: 0;

  &:hover {
    background-color: #ddd;
  }

  &.active {
    background-color: #fff;
    border-bottom: 2px solid #333;
  }
`;

function NavigationTabs() {
    return (
        <Tabs>
                <Tab  href="/signin">Login</Tab>
                <Tab  href="/register" >Register</Tab>
                <Tab  href="/">Releases</Tab>
                <Tab  href="/topContributors">Top Contributors</Tab>
                <Tab  href="/ressources">Resources</Tab>
        </Tabs>
    );
}

export default NavigationTabs
