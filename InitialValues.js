export const initialValues = [
	{
		name: "Executive Summary",
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
		dynamic: true,
		fields: [
			{
				name: "Product",
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
		fields: [
			{
				name: "Industry Analysis",
				fields: [
					{ name: "Industry Size", value: "" },
					{ name: "Industry Growth Rate", value: "" },
					{ name: "Industry Trends", value: "" },
					{ name: "Key Success Factors", value: "" },
				],
			},
			{
				name: "Target Market",
				fields: [
					{ name: "Market Segmentation", value: "" },
					{ name: "Target Customer Profile", value: "" },
					{ name: "Market Size", value: "" },
					{ name: "Market Growth Rate", value: "" },
				],
			},
			{
				name: "Competitive Analysis",
				dynamic: true,
				fields: [
					{
						name: "Competitor",
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
		fields: [
			{ name: "Marketing Objectives", value: "" },
			{
				name: "Marketing Mix",
				fields: [
					{ name: "Product Strategy", value: "" },
					{ name: "Pricing Strategy", value: "" },
					{ name: "Promotion Strategy", value: "" },
					{ name: "Distribution Strategy", value: "" },
				],
			},
			{
				name: "Sales Strategy",
				fields: [
					{ name: "Sales Process", value: "" },
					{ name: "Sales Forecast", value: "" },
				],
			},
		],
	},
	{
		name: "Financial Projections",
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
		dynamic: true,
		fields: [
			{
				name: "Team Members",
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
