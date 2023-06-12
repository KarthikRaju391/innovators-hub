import * as React from "react";
import { Drawer, ANCHOR } from "baseui/drawer";
import { Navigation } from "baseui/side-navigation";
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";

function SideNavUser({open, handleOpen}) {

    const session = useSession();
    const router = useRouter();
    const [activeItemId, setActiveItemId] = React.useState(router.pathname);
    // user role can be "user" or "investor" or "entrepreneur"
    const user={
      type: session?.data?.user?.role //  
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
          { title: "Create Projects", itemId: "/user/startup/project" },
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
      
      if (user?.type?.includes("INVESTOR") && !user?.type?.includes("ENTREPRENEUR")){
        customerSidebar.splice( 1, 0, investorSidebar )
      }

      if (!user?.type?.includes("INVESTOR") && user?.type?.includes("ENTREPRENEUR")){
        startupSidebar.subNav.splice(0,0,{ title: "Venture Ideas", itemId: "/user/investments/venture" })
        startupSidebar.subNav.splice(6,0, { title: "Community Forum", itemId: "/posts" })
        customerSidebar.splice( 1, 0, startupSidebar )
      }

      if (user?.type?.includes("INVESTOR") && user?.type?.includes("ENTREPRENEUR")){
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
            background: "radial-gradient(100.73% 375.72% at 0% 0%, #80A0F2 1.04%, #A194F0 38.54%, #C37FCE 67.15%, #973FB6 100%)",
            
          })
        },
      }}
        >
            <Navigation
                items = {customerSidebar}       
                activeItemId={activeItemId} 
                onChange={async ({ event, item }) =>{
                    setActiveItemId(item.itemId)
                    event.preventDefault();
                    router.push(item.itemId);
                  }
                }
            />
            <button onClick={handleTheme} className="ml-6 mt-2 pt-1 pl-7 text-base">Change to { nowTheme === 0 ? "Light" : "Dark"} Theme</button> <br/>
            { session.data ? <button onClick={()=>signOut()} className="mt-3 pt-2 ml-6 pl-7 text-base">Sign Out</button> : <button onClick={()=>signIn("google")} className="mt-3 pt-2 ml-6 pl-7 text-base">Sign In</button> }
        </Drawer>
    );
}

export default SideNavUser;