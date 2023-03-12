import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import {styletron} from '../styletron'
import { Provider as StyletronProvider } from 'styletron-react';
import { DarkTheme, LightTheme, BaseProvider } from 'baseui';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  const [theme, setTheme] = useState()

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

  return (
    <SessionProvider session={session}>
      <StyletronProvider value={styletron}>
        <BaseProvider theme={ theme===1 ? DarkTheme : LightTheme}>
          <Component {...pageProps} />
        </BaseProvider>
      </StyletronProvider>
    </SessionProvider>
  )
}

export default MyApp
