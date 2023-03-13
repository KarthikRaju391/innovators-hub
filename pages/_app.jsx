import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import {styletron} from '../styletron'
import { Provider as StyletronProvider } from 'styletron-react';
import { DarkTheme, LightTheme, BaseProvider } from 'baseui';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  const [theme, setTheme] = useState()
  const router = useRouter();

  useEffect(()=>{

    function handleLocalStorage() {
      var currentTheme = JSON.parse(localStorage.getItem("theme"));
      if (currentTheme === null || currentTheme === undefined) {
        localStorage.setItem("theme",JSON.stringify(1))
      }
      if (currentTheme === 1) {
        setTheme(1)
      }
      else if(currentTheme === 0){
        setTheme(0)
      }
    }
    handleLocalStorage()    
  })

  var path = router.pathname
  const pag = ["/", "/login", "/verify", "/contact us"]

  useEffect(() => {
    pag.includes(path) && document.body.classList.add('opback');
  }, []);

  useEffect(()=>{
      if (theme === 0) {
        document.body.classList.remove('insideLight');
        document.body.classList.add('insideBlack');
      } else {
        document.body.classList.remove('insideBlack');
        document.body.classList.add('insideLight');
      }
    }, [theme]);
  

  return (
    <SessionProvider session={session}>
      <StyletronProvider value={styletron}>
        <BaseProvider theme={ theme===1 ? LightTheme : DarkTheme}>
          <Component {...pageProps} />
        </BaseProvider>
      </StyletronProvider>
    </SessionProvider>
  )
}

export default MyApp
