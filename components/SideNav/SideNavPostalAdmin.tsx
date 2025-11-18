 import * as React from "react";
import { useRouter } from 'next/router';
import { supabase } from '../../src/lib/supabase';

interface SideNavPostalAdminProps {
  open: boolean;
  handleOpen: () => void;
}

function SideNavPostalAdmin({ open, handleOpen }: SideNavPostalAdminProps) {

    const router = useRouter();
    const [activeItemId, setActiveItemId] = React.useState(router.pathname);

    // get access type of the user
    var postalAccess = "Edit" //"View"

    
     let customerSidebar: any[] = [
        {
          title: "Postal Service",
          itemId: "",
          subNav: [
            { title: "View Orders", itemId: "/postalservice/vieworders" },
            { title: "History", itemId: "/postalservice/history" },
          ]
        }
      ]

      if (postalAccess === "Edit"){
        customerSidebar.splice( 0, 0,{title: "Dashboard", itemId: "/postalservice"} )
        customerSidebar[1].subNav.splice( 2, 0, { title: "Access Control", itemId: "/postalservice/accesscontrol" } )
      }

      if (postalAccess === "View"){
        customerSidebar.splice( 0, 0,{title: "Dashboard", itemId: "/postalview"} )
      }

       const handleTheme = () =>{
        const currentTheme = JSON.parse(localStorage.getItem("theme") || "0")
        localStorage.setItem("theme",JSON.stringify(currentTheme === 1 ? 0 : 1))
        handleOpen()
        router.replace(router.asPath);
      }

      let nowTheme = 0
      if (typeof window !== 'undefined') {
        // Perform localStorage action
        nowTheme = JSON.parse(localStorage.getItem("theme") || "0");
      }

    if (!open) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-64 bg-gradient-to-b from-blue-400 to-purple-600 p-4 text-white">
            <ul>
                {customerSidebar.map((item) => (
                    <li key={item.itemId} className="mb-4">
                        <div className="font-bold">{item.title}</div>
                        {item.subNav && (
                            <ul className="ml-4">
                                {item.subNav.map((sub: any) => (
                                    <li key={sub.itemId} className="cursor-pointer hover:underline" onClick={() => { setActiveItemId(sub.itemId); handleOpen(); router.push(sub.itemId); }}>
                                        {sub.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={handleTheme} className="ml-6 mt-2 pt-1 pl-7 text-base">Change to { nowTheme === 0 ? "Light" : "Dark"} Theme</button> <br/>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/'); }} className="mt-3 pt-2 ml-6 pl-7 text-base">Sign Out</button>
        </div>
    );
}

export default SideNavPostalAdmin;