import * as React from "react";
import { ListIcon } from "@phosphor-icons/react";
import SideNavUser from "./SideNav/SideNavUser";
import SideNavPostalAdmin from "./SideNav/SideNavPostalAdmin";
import { useRouter } from "next/router";
import { supabase } from '../src/lib/supabase';

function LoginHeader() {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [role, setRole] = React.useState("USER");

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      // For now, set role to USER, later fetch from db
      setRole("USER");
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => {
    setIsOpen(false);
  };

  const openDraw = () => {
    setIsOpen(true);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {role?.includes("USER") && (
        <SideNavUser open={isOpen} handleOpen={handleOpen} />
      )}
      {role?.includes("ADMIN") && (
        <SideNavPostalAdmin open={isOpen} handleOpen={handleOpen} />
      )}
      <nav className="bg-white border-b shadow-sm flex justify-between items-center px-4 py-2">
        <div
          className="text-xl font-bold"
          style={{
            fontFamily: "Syncopate",
            userSelect: "none",
          }}
        >
          Innovators' Hub
        </div>
        <div className="flex items-center">
          {user?.user_metadata?.full_name || user?.email}
        </div>
        <ListIcon
          className="text-xl mr-4 cursor-pointer"
          onClick={openDraw}
        />
      </nav>
    </>
  );
}

export default LoginHeader;
