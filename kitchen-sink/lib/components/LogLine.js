import React, { useState } from 'react';

const LogLine = ({ data, kind, index, code }) => {
	const [expanded, setExpanded] = useState(false);

	let str = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
	let expandable = false;
	if (str && str.length > 300 && !expanded) {
		str = `${str.split('\n').slice(0, 9).join('\n')}...`;
		expandable = true;
	}

	return (
		<div
			className={kind === 'debug' ? 'text-green-500 my-12' : kind === 'http' ? 'mt-6 text-blue-400 font-semibold' : (kind === 'req' ? 'text-gray-600' : '')}
		>
			{code > 0 && <div className="font-bold font-mono pt-2">Responded with status code {code}:</div>}
			<span className="font-mono">{str}</span>
			{expandable && !expanded &&
				<button onClick={() => setExpanded(true)} className="ml-2 text-sm opacity-50">(view all)</button>}
		</div>
	);
};

export default LogLine;
