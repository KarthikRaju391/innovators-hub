import React from "react";

const SubmitContext = React.createContext({
	updated: false,
	setUpdated: () => {},
	project: {
		projectName: "",
		projectDescription: "",
		projectImages: [],
		projectReport: {},
	},
	setProject: () => {},
});

export default SubmitContext;
