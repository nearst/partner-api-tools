import { Check } from 'react-feather';

const Step = ({ num, completed, children }) => (
	<div className="mt-10 flex">
		{completed ? (
			<div
				className="rounded-full bg-green-200 text-green-600 h-10 w-10 text-xl font-bold text-center flex items-center justify-center">
				<Check/>
			</div>
		) : (
			<div
				className="rounded-full bg-gray-200 text-gray-500 h-10 w-10 text-xl text-center flex items-center justify-center">
				{num}
			</div>
		)}
		<div className="flex-1 ml-6 pt-2">
			{children}
		</div>
	</div>
);

export default Step;
