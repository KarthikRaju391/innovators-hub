import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function Header() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Get initial session
		const getSession = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			setUser(session?.user ?? null);
			setLoading(false);
		};

		getSession();

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setUser(session?.user ?? null);
				setLoading(false);
			}
		);

		return () => subscription.unsubscribe();
	}, []);

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push('/');
	};

	if (loading) {
		return (
			<nav className="bg-white border-b shadow-sm flex justify-between items-center px-4 py-2">
				<div className="text-xl font-bold">
					Innovators' Hub
				</div>
				<div className="text-sm text-gray-500">Loading...</div>
			</nav>
		);
	}

	return (
		<nav className="bg-white border-b shadow-sm flex justify-between items-center px-4 py-2">
			<div className="text-xl font-bold">
				Innovators' Hub
			</div>
			<ul className="flex space-x-6">
				<div className="flex space-x-4">
					<li className="hover:text-blue-500 cursor-pointer" onClick={() => router.push('/')}>
						Home
					</li>
					<li className="hover:text-blue-500 cursor-pointer" onClick={() => router.push('/aboutus')}>
						About Us
					</li>
				</div>
				<div className="flex space-x-4">
					{user ? (
						<>
							<li className="text-gray-700">
								Welcome, {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}
							</li>
							<li className="hover:text-blue-500 cursor-pointer" onClick={handleLogout}>
								Logout
							</li>
						</>
					) : (
						<li className="hover:text-blue-500 cursor-pointer" onClick={() => router.push('/login')}>
							Login
						</li>
					)}
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
