import { useState } from "react";

export default (defaultValue) => {
	const [value, setValue] = useState(defaultValue);

	const onChange = (e) => {
		const {
			target: { value: newValue },
		} = e;
		setValue(newValue);
	};

	return { value, onChange, setValue };
};
