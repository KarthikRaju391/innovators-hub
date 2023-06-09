import { useRouter } from "next/router";
import classes from "../styles/header.module.css";
import { signIn, signOut, useSession } from "next-auth/react";

function Header() {
	const { data: session } = useSession();
	
	const router = useRouter()


	return (
		<nav className={`${classes.naver} flex`}>
			<div className={classes.name} onClick={() => router.push('/')}>Innovators' Hub</div>
			<ul className={classes.uls}>
					<div className="flex">
						<li className={classes.lis} onClick={()=>router.push("/")}>Home</li>
						<li className={classes.lis} onClick={()=>router.push("/aboutus")}>About Us</li>
						<li className={classes.lis} onClick={()=>router.push("/products")}>Shop</li>
					</div>
					<div className="flex">
						<li className={classes.lis} onClick={()=>router.push("/verify")}>Verify</li>
						{!session && <li className={classes.lis} onClick={() => { signIn("google"); }}>Get Started</li> }
						{session && (<li onClick={() => router.push("/user")} className={classes.lis}>Dashboard</li>)}	
					</div>
					<div className="flex">
						<li className={classes.lis} onClick={()=>router.push("/posts")}>Community Forum</li>
						{session && (<li onClick={() => signOut()} className={classes.lis}>Logout</li>)}	
					</div>
			</ul>
		</nav>

		// <div className={"flex flex-col md:flex-row " + `${classes.naver}`}>
		//   <div className={"flex-none " + `${classes.name}`}>
		//   Innovators' Hub
		//   </div>
		//   <div className="flex-1 w-100">
		//   </div>
		//   <div className="flex-1 w-32">
		//     <ul className='flex flex-wrap'>
		//       <li className={classes.lis}>Home</li>
		//       <li className={classes.lis}>Contact us</li>
		//       <li className={classes.lis}>Verify</li>
		//       <li className={classes.lis}>Get Started</li>
		//     </ul>
		//   </div>
		// </div>
	);
}

export default Header;
