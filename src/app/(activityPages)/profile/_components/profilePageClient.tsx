import React from "react";

type ProfileCardProps = {
	name: string;
	id: string;
	points: number;
	quests: string[];
};

export default function ProfileClient({
	name,
	id,
	points,
	quests,
}: ProfileCardProps) {
	return (
		<div className='w-64 bg-gray-800 text-white p-4 rounded-lg'>
			<div className='flex items-center mb-4'>
				<div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3'>
					<svg
						className='w-6 h-6 text-white'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
						/>
					</svg>
				</div>
				<div>
					<h2 className='text-lg font-semibold'>{name}</h2>
					<p className='text-xs text-gray-400'>{id}</p>
				</div>
				<div className='ml-auto'>
					<p className='text-xl font-bold'>{points}</p>
					<p className='text-xs text-gray-400'>Total points</p>
				</div>
			</div>

			<div className='mb-4'>
				<div className='w-full h-24 bg-gray-700 rounded-lg relative'>
					{/* Placeholder for the graph */}
					<svg
						className='w-full h-full'
						viewBox='0 0 100 100'
						preserveAspectRatio='none'>
						<path
							d='M0,50 Q25,30 50,50 T100,50'
							fill='none'
							stroke='white'
							strokeWidth='2'
						/>
					</svg>
				</div>
			</div>

			<div>
				<h3 className='text-sm font-semibold mb-2'>Quests</h3>
				{quests.map((quest, index) => (
					<div
						key={index}
						className='bg-gray-700 p-2 rounded mb-2'>
						<p className='text-sm'>{quest}</p>
					</div>
				))}
			</div>
		</div>
	);
}
