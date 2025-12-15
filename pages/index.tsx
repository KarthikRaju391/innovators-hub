import * as React from "react";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import ProjectFilters from "../components/ProjectFilters";
import ProjectGrid from "../components/ProjectGrid";
import StatsSection from "../components/StatsSection";
import { useRouter } from "next/router";
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { Sparkles, Rocket, Heart } from "lucide-react";

const supabase = createBrowserClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function Home() {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState<{
		tag?: string;
		tech?: string;
		sort: string;
		searchQuery?: string;
	}>({
		sort: 'new',
	});

	// Initialize filters from URL parameters
	useEffect(() => {
		if (router.isReady) {
			setFilters({
				tag: (router.query.tag as string) || undefined,
				tech: (router.query.tech as string) || undefined,
				sort: (router.query.sort as string) || 'new',
				searchQuery: (router.query.q as string) || undefined,
			});
		}
	}, [router.isReady, router.query]);

	useEffect(() => {
		const getSession = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			setUser(session?.user ?? null);
			setLoading(false);
		};

		getSession();

		const { data: { subscription } } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setUser(session?.user ?? null);
				setLoading(false);
			}
		);

		return () => subscription.unsubscribe();
	}, []);

	const handleFiltersChange = (newFilters: {
		tag?: string;
		tech?: string;
		sort: string;
		searchQuery?: string;
	}) => {
		setFilters(newFilters);

		// Update URL with filter parameters
		const params = new URLSearchParams();
		if (newFilters.tag) params.set('tag', newFilters.tag);
		if (newFilters.tech) params.set('tech', newFilters.tech);
		if (newFilters.sort && newFilters.sort !== 'new') params.set('sort', newFilters.sort);
		if (newFilters.searchQuery) params.set('q', newFilters.searchQuery);

		const queryString = params.toString();
		router.push(queryString ? `/?${queryString}` : '/', undefined, { shallow: true });
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<Header />

			{/* Hero Section */}
			<div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
						<Sparkles className="w-4 h-4" />
						<span>For builders using AI tools</span>
					</div>
					<h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl mb-6">
						<span className="block">Discover Projects Built</span>
						<span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
							with AI Coding Tools
						</span>
					</h1>
					<p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
						Share your POCs, get feedback from the community, and support creators pushing the boundaries of AI-assisted development.
					</p>

					{/* CTAs */}
					<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
						{user ? (
							<button
								onClick={() => router.push('/dashboard')}
								className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
							>
								<Rocket className="w-5 h-5" />
								Go to Dashboard
							</button>
						) : (
							<>
								<button
									onClick={() => router.push('/login')}
									className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all"
								>
									<Rocket className="w-5 h-5" />
									Join as Creator
								</button>
								<button
									onClick={() => {
										document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
									}}
									className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-indigo-600 text-lg font-semibold rounded-lg text-indigo-600 bg-white hover:bg-indigo-50 transition-all"
								>
									<Heart className="w-5 h-5" />
									Explore Projects
								</button>
							</>
						)}
					</div>

					{/* Value Props */}
					<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
						<div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white mb-4">
								<Sparkles className="w-6 h-6" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">Share Your POCs</h3>
							<p className="text-gray-600">
								Showcase projects built with Claude Code, Cursor, GitHub Copilot, and more. Build in public and iterate with community support.
							</p>
						</div>
						<div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white mb-4">
								<Rocket className="w-6 h-6" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">Get Feedback</h3>
							<p className="text-gray-600">
								Connect with other builders, get early feedback, and discover new approaches to AI-assisted development.
							</p>
						</div>
						<div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
							<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white mb-4">
								<Heart className="w-6 h-6" />
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-2">Support Creators</h3>
							<p className="text-gray-600">
								Back the creators you believe in and help them turn their POCs into full-fledged products.
							</p>
						</div>
					</div>
				</div>

				{/* Stats Section */}
				<StatsSection />

				{/* Projects Section */}
				<div id="projects">
					<ProjectFilters
						onFiltersChange={handleFiltersChange}
						initialFilters={filters}
					/>
					<ProjectGrid
						tag={filters.tag}
						tech={filters.tech}
						sort={filters.sort}
						searchQuery={filters.searchQuery}
						currentUserId={user?.id}
					/>
				</div>
			</div>
		</div>
	);
}

export default Home;
