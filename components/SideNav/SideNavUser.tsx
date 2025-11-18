import * as React from "react";
import { useRouter } from 'next/router';
// import { useSession, signIn, signOut } from "next-auth/react";

function SideNavUser({open, handleOpen}: {open: boolean, handleOpen: () => void}) {

    // const session = useSession();
    const session = { data: null };
    const router = useRouter();
    const [activeItemId, setActiveItemId] = React.useState(router.pathname);
    // user role can be "user" or "investor" or "entrepreneur"
    const user={
      type: null as string | null // session?.data?.user?.role
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
        const theme = localStorage.getItem("theme")
        const currentTheme = theme ? JSON.parse(theme) : 0
        localStorage.setItem("theme",JSON.stringify(currentTheme === 1 ? 0 : 1))
        handleOpen()
        router.replace(router.asPath);
      }

      var nowTheme = 0
      if (typeof window !== 'undefined') {
        // Perform localStorage action
        const theme = localStorage.getItem("theme");
        nowTheme = theme ? JSON.parse(theme) : 0;
      }

    return (
        <div className={`fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-blue-400 to-purple-600 transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform z-50`}>
            <ul className="p-4">
                {customerSidebar.map((item) => (
                    <li key={item.itemId} className={`p-2 ${activeItemId === item.itemId ? 'bg-white bg-opacity-20' : ''}`}>
                        <a href={item.itemId} onClick={(e) => { setActiveItemId(item.itemId); handleOpen(); }}>{item.title}</a>
                        {item.subNav && (
                            <ul className="ml-4">
                                {item.subNav.map((sub) => (
                                    <li key={sub.itemId} className="p-1">
                                        <a href={sub.itemId} onClick={handleOpen}>{sub.title}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={handleTheme} className="ml-6 mt-2 pt-1 pl-7 text-base text-white">Change to { nowTheme === 0 ? "Light" : "Dark"} Theme</button> <br/>
            {/* { session.data ? <button onClick={()=>signOut({callbackUrl: '/'})} className="mt-3 pt-2 ml-6 pl-7 text-base text-white">Sign Out</button> : <button onClick={()=>signIn("google")} className="mt-3 pt-2 ml-6 pl-7 text-base text-white">Sign In</button> } */}
            <button onClick={handleOpen} className="absolute top-4 right-4 text-white">X</button>
        </div>
    );
}

export default SideNavUser;