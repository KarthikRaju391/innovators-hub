import * as React from "react";
import { Drawer, ANCHOR } from "baseui/drawer";
import { Navigation } from "baseui/side-navigation";
import { useRouter } from 'next/router';

function SideNavUser({open, handleOpen}) {

    const router = useRouter();
    const [activeItemId, setActiveItemId] = React.useState("#primary");
    
    const items=[
        {
          title: "Colors",
          itemId: "#colors",
          subNav: [
            { title: "Primary", itemId: "#primary" },
            {
              title: "Shades",
              itemId: "#shades",
              subNav: [
                { title: "Dark", itemId: "#dark" },
                {
                  title: "Disabled",
                  itemId: "#disabled",
                  disabled: true
                }
              ]
            }
          ]
        }
      ]

      var handleTheme = () =>{
        var currentTheme = JSON.parse(localStorage.getItem("theme"))
        localStorage.setItem("theme",JSON.stringify(currentTheme === 1 ? 0 : 1))
        router.replace(router.asPath);
      }

    return (
        <Drawer
            isOpen={open}
            autoFocus
            onClose={() => handleOpen()}
            anchor={ANCHOR.right}
        >
            <Navigation
                items = {items}       
                activeItemId={activeItemId}        
                onChange={({ item }) =>
                    setActiveItemId(item.itemId)
                }
            />
            <button onClick={handleTheme}>Change Theme</button>
        </Drawer>
    );
}

export default SideNavUser;