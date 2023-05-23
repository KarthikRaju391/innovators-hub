import React from "react";

const SubmitContext = React.createContext({
	submitted: false,
	setSubmitted: () => {},
	project: {
		projectName: "",
		projectDescription: "",
		projectImages: [],
		projectReport: {},
	},
    setProject: () => {},
});

export default SubmitContext;
