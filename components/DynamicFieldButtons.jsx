import React from "react";

const DynamicFieldButtons = React.memo(
	({ name, fields, fieldTemplate, push, pop }) => {
		const handleAddField = () => {
			push(fieldTemplate);
		};

		const handleRemoveField = () => {
			if (fields.length > 1) {
				pop();
			}
		};

		return (
			<div className="flex justify-end">
				<button
					type="button"
					onClick={handleAddField}
					className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
				>
					Add{" "}
					{name === "Team Members"
						? "Member"
						: name === "Products and Services"
						? "Product"
						: "Competitor"}
				</button>
				<button
					type="button"
					className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
					onClick={handleRemoveField}
				>
					Remove{" "}
					{name === "Team Members"
						? "Member"
						: name === "Products and Services"
						? "Product"
						: "Competitor"}
				</button>
			</div>
		);
	}
);

export default DynamicFieldButtons;
