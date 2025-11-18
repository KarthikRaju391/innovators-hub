export const initialValues = [
	{
		name: "Executive Summary",
		level: 0,
		fields: [
			{ name: "Problem", value: "" },
			{ name: "Solution", value: "" },
			{ name: "Target Market", value: "" },
			{ name: "Competitive Advantage", value: "" },
			{ name: "Financial Highlights", value: "" },
			{ name: "Funding Requirements", value: "" },
			{ name: "Use of Funds", value: "" },
			{ name: "Exit Strategy", value: "" },
		],
	},
	{
		name: "Company Overview",
		level: 0,
		fields: [
			{ name: "Company Name", value: "" },
			{ name: "Mission Statement", value: "" },
			{ name: "Company History", value: "" },
			{ name: "Legal Structure", value: "" },
			{ name: "Location", value: "" },
			{ name: "Image", value: [] },
		],
	},
	{
		name: "Products and Services",
		level: 0,
		dynamic: true,
		fields: [
			{
				name: "Product",
				level: 1,
				fields: [
					{
						name: "Product Name",
						value: "",
					},
					{
						name: "Description",
						value: "",
					},
					{
						name: "Features",
						value: "",
					},
					{
						name: "Benefits",
						value: "",
					},
					{
						name: "Pricing Strategy",
						value: "",
					},
					{
						name: "Development Timeline",
						value: "",
					},
					{
						name: "Image",
						value: [],
					},
				],
			},
		],
	},
	{
		name: "Market Analysis",
		level: 0,
		fields: [
			{
				name: "Industry Analysis",
				level: 1,
				fields: [
					{ name: "Industry Size", value: "" },
					{ name: "Industry Growth Rate", value: "" },
					{ name: "Industry Trends", value: "" },
					{ name: "Key Success Factors", value: "" },
				],
			},
			{
				name: "Target Market",
				level: 1,
				fields: [
					{ name: "Market Segmentation", value: "" },
					{ name: "Target Customer Profile", value: "" },
					{ name: "Market Size", value: "" },
					{ name: "Market Growth Rate", value: "" },
				],
			},
			{
				name: "Competitive Analysis",
				level: 1,
				dynamic: true,
				fields: [
					{
						name: "Competitor",
						level: 2,
						fields: [
							{
								name: "Competitor Name",
								value: "",
							},
							{
								name: "Competitor Strengths",
								value: "",
							},
							{
								name: "Competitor Weaknesses",
								value: "",
							},
						],
					},
				],
			},
			{
				name: "SWOT Analysis",
				level: 1,
				fields: [
					{ name: "Strengths", value: "" },
					{ name: "Weaknesses", value: "" },
					{ name: "Opportunities", value: "" },
					{ name: "Threats", value: "" },
					{ name: "Image", value: [] },
				],
			},
		],
	},
	{
		name: "Marketing Strategy",
		level: 0,
		fields: [
			{ name: "Marketing Objectives", value: "" },
			{
				name: "Marketing Mix",
				level: 1,
				fields: [
					{ name: "Product Strategy", value: "" },
					{ name: "Pricing Strategy", value: "" },
					{ name: "Promotion Strategy", value: "" },
					{ name: "Distribution Strategy", value: "" },
				],
			},
			{
				name: "Sales Strategy",
				level: 1,
				fields: [
					{ name: "Sales Process", value: "" },
					{ name: "Sales Forecast", value: "" },
				],
			},
		],
	},
	{
		name: "Financial Projections",
		level: 0,
		fields: [
			{ name: "Revenue Projections", value: "" },
			{ name: "Expense Projections", value: "" },
			{ name: "Profit and Loss Statement", value: "" },
			{ name: "Cash Flow Statement", value: "" },
			{ name: "Balance Sheet", value: "" },
			{ name: "Break Even Analysis", value: "" },
			{ name: "Financial Assumptions", value: "" },
			{ name: "Financial Ratios", value: "" },
		],
	},
	{
		name: "Team",
		level: 0,
		dynamic: true,
		fields: [
			{
				name: "Team Members",
				level: 1,
				fields: [
					{
						name: "Name",
						value: "",
					},
					{
						name: "Title",
						value: "",
					},
					{
						name: "Experience",
						value: "",
					},
					{ name: "Role", value: "" },
					{
						name: "Image",
						value: [],
					},
				],
			},
		],
	},
];
