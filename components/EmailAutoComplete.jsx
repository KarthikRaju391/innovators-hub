import React, { useState } from "react";
import { subCategories } from "../constants/BusinessTypes";
import { Input } from "baseui/input";

const EmailAutocomplete = ({ emails, allowEmail, setAllowEmail }) => {
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

	const handleChange = (e) => {
		const userInput = e.currentTarget.value;
		const filteredSuggestions = emails.filter(
			(suggestion) =>
				suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
		);
		setFilteredSuggestions(filteredSuggestions);
		setShowSuggestions(true);
		setAllowEmail(userInput)
	};

	// ... other methods

	return (
		<div>
			<Input
				disabled={emails.length < 1 ? true : false}
				placeholder={emails.length < 1 ? "No emails found" : emails}
				value={allowEmail}
				onChange={(e) => handleChange(e)}
			/>
			{showSuggestions && allowEmail && (
				<ul>
					{filteredSuggestions.map((suggestion, index) => {
						return (
							<li
								className="cursor-pointer"
								onClick={() => {
									setAllowEmail(suggestion);
									setFilteredSuggestions([]);
								}}
								key={index}
							>
								{suggestion}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default EmailAutocomplete;
