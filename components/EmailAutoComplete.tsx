import React, { useState } from "react";
import { subCategories } from "../constants/BusinessTypes";

interface Props {
	emails: string[];
	allowEmail: string;
	setAllowEmail: (email: string) => void;
}

const EmailAutocomplete = ({ emails, allowEmail, setAllowEmail }: Props) => {
	const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
			<input
				disabled={emails.length < 1}
				placeholder={emails.length < 1 ? "No emails found" : "Enter email"}
				value={allowEmail}
				onChange={(e) => handleChange(e)}
				className="border rounded px-2 py-1 w-full"
			/>
			{showSuggestions && allowEmail && (
				<ul className="border bg-white">
					{filteredSuggestions.map((suggestion, index) => {
						return (
							<li
								className="cursor-pointer p-1 hover:bg-gray-100"
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
