import * as React from "react";
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";
import { TiThMenu } from 'react-icons/ti';
import SideNavUser from "../components/SideNav/SideNavUser";
import classes from '../styles/header.module.css'

function LoginHeader() {

    const user = "User"

    const [isOpen, setIsOpen] = React.useState(false);

    var handleOpen = () =>{
        setIsOpen(false)
    }

    var openDraw = () =>{
        setIsOpen(true)
    }

    return (
        <>
        <SideNavUser open={isOpen} handleOpen={handleOpen}/>
        <HeaderNavigation className={classes.uls } style={{ borderRadius: "0" }}>
      <StyledNavigationList $align={ALIGN.left}>
        <StyledNavigationItem>
            <StyledLink style={{fontSize: "1.5rem", textDecoration: "none", fontFamily:"Syncopate", fontWeight: "550", userSelect: "none"}}>Innovators' Hub</StyledLink>
        </StyledNavigationItem>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.center} >
      <StyledNavigationItem>
          <StyledLink href="#basic-link1">
            {user}
          </StyledLink>
        </StyledNavigationItem>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.right}>
        <StyledNavigationItem>
          <StyledLink>
            <TiThMenu style={{marginRight:"1rem", fontSize: "1.2rem"}} title="Menu" onClick={() => openDraw()} />
          </StyledLink>
        </StyledNavigationItem>
      </StyledNavigationList>
    </HeaderNavigation>
    </>
    );
}

export default LoginHeader;