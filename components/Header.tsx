import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import UserMenu from "./UserMenu";
import { Sparkles } from "lucide-react";

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

	return (
		<nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div
						className="flex items-center gap-2 cursor-pointer group"
						onClick={() => router.push('/')}
					>
						<div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
							<Sparkles className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
							Innovators' Hub
						</span>
					</div>

					{/* Navigation */}
					<div className="flex items-center gap-6">
						<button
							onClick={() => router.push('/')}
							className={`text-sm font-medium transition-colors ${
								router.pathname === '/'
									? 'text-indigo-600'
									: 'text-gray-700 hover:text-indigo-600'
							}`}
						>
							Explore
						</button>

						{user && (
							<button
								onClick={() => router.push('/dashboard')}
								className={`text-sm font-medium transition-colors ${
									router.pathname.startsWith('/dashboard')
										? 'text-indigo-600'
										: 'text-gray-700 hover:text-indigo-600'
								}`}
							>
								Dashboard
							</button>
						)}

						{loading ? (
							<div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
						) : user ? (
							<UserMenu user={user} onLogout={handleLogout} />
						) : (
							<button
								onClick={() => router.push('/login')}
								className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
							>
								Sign In
							</button>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Header;
