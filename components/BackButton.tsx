import { useRouter } from 'next/router'
import { ArrowLeft } from '@phosphor-icons/react';
import React from 'react';

function BackButton() {
    const [hydrated, setHydrated] = React.useState(false);
    
    React.useEffect(() => {
        setHydrated(true);
    }, []);
    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }

    const router = useRouter()

    const handleClick = () => {
        router.back()
      }

       var nowTheme
       if (typeof window !== 'undefined') {
         // Perform localStorage action
         const theme = localStorage.getItem("theme");
         nowTheme = theme ? JSON.parse(theme) === 0 ? "#262626" : "#9aa0a6" : "#9aa0a6";
       }

    return (
        <div
            style={{ position: 'fixed', top: "4.5rem", left: "10px", padding: '10px', zIndex: 999, fontSize: "2rem", backgroundColor: nowTheme, borderRadius:"20px", cursor: "pointer"}}
            onClick={handleClick}
            title="Go Back"
        >
            <ArrowLeft/> 
        </div>
    );
}

export default BackButton;
