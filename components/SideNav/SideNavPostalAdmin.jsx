import * as React from "react";
import { Drawer, ANCHOR } from "baseui/drawer";
import { Navigation } from "baseui/side-navigation";
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";

function SideNavPostalAdmin({open, handleOpen}) {

    const session = useSession();
    const router = useRouter();
    const [activeItemId, setActiveItemId] = React.useState(router.pathname);

    // get access type of the user
    var postalAccess = "Edit" //"View"

    
    var customerSidebar =[
        {
          title: "Postal Service",
          itemId: "",
          subNav: [
            { title: "View Orders", itemId: "/postalservice/vieworders" },
            { title: "History", itemId: "/postalservice/history" },
          ]
        }
      ]

      if (postalAccess === "Edit" && postalAccess !=="View"){
        customerSidebar.splice( 0, 0,{title: "Dashboard", itemId: "/postalservice"} )
        customerSidebar[1].subNav.splice( 2, 0, { title: "Access Control", itemId: "/postalservice/accesscontrol" } )
      }

      if (postalAccess === "View" && postalAccess !=="Edit"){
        customerSidebar.splice( 0, 0,{title: "Dashboard", itemId: "/postalview"} )
      }

      var handleTheme = () =>{
        var currentTheme = JSON.parse(localStorage.getItem("theme"))
        localStorage.setItem("theme",JSON.stringify(currentTheme === 1 ? 0 : 1))
        handleOpen()
        router.replace(router.asPath);
      }

      var nowTheme
      if (typeof window !== 'undefined') {
        // Perform localStorage action
        nowTheme = JSON.parse(localStorage.getItem("theme"));
      }

    return (
        <Drawer
            isOpen={open}
            autoFocus
            onClose={() => handleOpen()}
            anchor={ANCHOR.right}
            overrides={{
        DrawerContainer: {
          style: ({ $theme }) => ({
            background: "radial-gradient(100.73% 375.72% at 0% 0%, #80A0F2 1.04%, #A194F0 38.54%, #C37FCE 67.15%, #973FB6 100%)",
            
          })
        },
      }}
        >
            <Navigation
                items = {customerSidebar}       
                activeItemId={activeItemId} 
                onChange={async ({ event, item }) =>{
                    await setActiveItemId(item.itemId)
                    event.preventDefault();
                    router.push(item.itemId);
                  }
                }
            />
            <button onClick={handleTheme} className="ml-6 mt-2 pt-1 pl-7 text-base">Change to { nowTheme === 0 ? "Light" : "Dark"} Theme</button> <br/>
            { session.data ? <button onClick={()=>signOut()} className="mt-3 pt-2 ml-6 pl-7 text-base">Sign Out</button> : <button onClick={()=>signIn()} className="mt-3 pt-2 ml-6 pl-7 text-base">Sign In</button> }
        </Drawer>
    );
}

export default SideNavPostalAdmin;