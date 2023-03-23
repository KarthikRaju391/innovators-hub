import * as React from "react";
import { Drawer, ANCHOR } from "baseui/drawer";
import { Navigation } from "baseui/side-navigation";
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";

function SideNavUser({open, handleOpen}) {

    const session = useSession();
    const router = useRouter();
    const [activeItemId, setActiveItemId] = React.useState(router.pathname);
    const user={
      type: ["user", "", "entrepreneur"] //investor
  }

    
    var customerSidebar =[
      {title: "Dashboard", itemId: "/user"},
        {
          title: "Purchase",
          itemId: "",
          subNav: [
            { title: "Products", itemId: "/products" },
            { title: "Cart", itemId: "/user/purchase/cart" },
            { title: "Live Orders", itemId: "/user/purchase/liveorders" },
            { title: "Order History", itemId: "/user/purchase/ordershistory" },
          ]
        },
        {
          title: "Settings",
          itemId: "",
          subNav: [
            { title: "View Profile", itemId: "/user/settings/viewprofile" },
            { title: "Manage Profile", itemId: "/user/settings/manageprofile" },
          ]
        },
      ]

      var startupSidebar = {
        title: "Startup",
        itemId: "",
        subNav: [
          { title: "Create Projects", itemId: "/user/startup/createproject" },
          { title: "Sell Products", itemId: "/user/startup/sellproducts" },
          { title: "Create Products", itemId: "/user/startup/createproduct" },
          { title: "Orders", itemId: "/user/startup/orders" },
        ]
      }

      var investorSidebar = {
        title: "Investments",
        itemId: "",
        subNav: [
          { title: "Investment History", itemId: "/user/investments/investmenthistory" },
          { title: "Venture", itemId: "/user/investments/venture" },
          { title: "Community Forum", itemId: "/posts" },
        ]
      }

      if (user.type.includes("investor") && !user.type.includes("entrepreneur")){
        customerSidebar.splice( 1, 0, investorSidebar )
      }

      if (!user.type.includes("investor") && user.type.includes("entrepreneur")){
        startupSidebar.subNav.splice(0,0,{ title: "Venture Ideas", itemId: "/user/investments/venture" })
        startupSidebar.subNav.splice(6,0, { title: "Community Forum", itemId: "/posts" })
        customerSidebar.splice( 1, 0, startupSidebar )
      }

      if (user.type.includes("investor") && user.type.includes("entrepreneur")){
        customerSidebar.splice( 1, 0, startupSidebar, investorSidebar )
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
            background: "radial-gradient(100% 44171.21% at 0% -100%, rgba(143, 125, 252, 0.85) 0%, rgba(151, 137, 238, 0.6885) 34.11%, rgba(146, 69, 158, 0.493) 60.51%, rgba(138, 17, 181, 0.774) 100%)",
            
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

export default SideNavUser;