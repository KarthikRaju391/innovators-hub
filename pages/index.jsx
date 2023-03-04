import Head from 'next/head'
import { signIn, signOut, useSession } from 'next-auth/react'
import Login from '../components/Login';
import AddPost from '../components/AddPost';
import ListComments from '../components/ListComments';

const Home = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />

        {!session.user.pan ? <Login /> : null}
        <AddPost />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}


export default Home
