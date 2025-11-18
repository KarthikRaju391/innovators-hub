 import React, { useState } from "react";
import { subCategories } from "../constants/BusinessTypes";
import { Input } from "./ui/input";

interface AutocompleteProps {
  mainCategory: Array<{ id: string }>;
  subCategory: string;
  setSubCategory: (value: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ mainCategory, subCategory, setSubCategory }) => {
	const [activeSuggestion, setActiveSuggestion] = useState("");
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [userInput, setUserInput] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const userInput = e.currentTarget.value;
		const filteredSuggestions = (subCategories as any)[mainCategory[0].id].filter(
			(suggestion: string) =>
				suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
		);
		setSubCategory(userInput);
		// setActiveSuggestion(userInput);
		setFilteredSuggestions(filteredSuggestions);
		setShowSuggestions(true);
		setUserInput(userInput);
	};

	// ... other methods

	return (
		<div>
			<Input
				disabled={mainCategory ? false : true}
				placeholder={mainCategory[0] && (subCategories as any)[mainCategory[0].id]}
				value={subCategory}
				onChange={(e) => handleChange(e)}
			/>
			{showSuggestions && userInput && (
				<ul>
					{filteredSuggestions.map((suggestion, index) => {
						return (
							<li
								className="cursor-pointer"
								onClick={() => {
									setSubCategory(suggestion);
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

export default Autocomplete;
