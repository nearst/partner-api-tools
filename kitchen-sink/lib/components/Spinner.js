import React from 'react';
import { Loader } from 'react-feather';

const Spinner = ({ className = '' }) => {
	return (
		<div>
			<Loader size={24} color="gray" className={`animate-spin ${className}`}/>
		</div>
	);
};

export default Spinner;
