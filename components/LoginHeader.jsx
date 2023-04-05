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
import { useSession } from 'next-auth/react';
import { Avatar } from "baseui/avatar";
import {Block} from 'baseui/block';
import { StatefulTooltip } from "baseui/tooltip";
import SideNavPostalAdmin from "./SideNav/SideNavPostalAdmin";

function LoginHeader() {

    const session = useSession()
    // console.log(session.data)
    const user = (session?.data?.user.name) || ""

    const role =  "postal admin" //"user" or "investor" or "entrepreneur" or JUST "admin"

    const [isOpen, setIsOpen] = React.useState(false);

    var handleOpen = () =>{
        setIsOpen(false)
    }

    var openDraw = () =>{
        setIsOpen(true)
    }

    return (
        <>
          {role === "user" && <SideNavUser open={isOpen} handleOpen={handleOpen}/>}
          {role === "postal admin" && <SideNavPostalAdmin open={isOpen} handleOpen={handleOpen}/>}
          <HeaderNavigation className={classes.uls } style={{ borderRadius: "0" }}>
            <StyledNavigationList $align={ALIGN.left}>
              <StyledNavigationItem>
                <StyledLink style={{fontSize: "1.5rem", textDecoration: "none", fontFamily:"Syncopate", fontWeight: "550", userSelect: "none"}}>Innovators' Hub</StyledLink>
              </StyledNavigationItem>
            </StyledNavigationList>
            <StyledNavigationList $align={ALIGN.center} >
              <StyledNavigationItem>
                  <StyledLink style={{cursor: "default"}}>

                    <StatefulTooltip
                      content={() => (
                        <Block padding={"20px"}>
                          <span className="flex justify-center">
                            <Avatar
                              name={user}
                              size="scale1200"
                              src={ session?.data?.user?.image || ""}
                            />
                          </span>
                            <br/>
                            <p>{role}</p>
                        </Block>
                      )}
                      returnFocus
                      autoFocus
                    >
                      {user}
                    </StatefulTooltip>

                    
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