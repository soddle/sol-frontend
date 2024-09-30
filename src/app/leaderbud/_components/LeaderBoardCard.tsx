"use client";

import { useState } from "react";

type GameCardProps = {
	gameName: string;
	className?: string;
};

type GameTypes = {
	id: number;
	title: string;
	className?: string;
};

const gameTypes: GameTypes[] = [
	{
		id: 1,
		title: "Attributes",
		className:
			"bg-gradient-to-br from-[#013401] from-30% to-[#111411] to-70% text-[#30D212]",
	},
	{
		id: 2,
		title: "Tweet",
	},
	{
		id: 3,
		title: "Emoji",
	},
];

function GameCard({ gameName, className = "" }: GameCardProps) {
	return (
		<button
			className={`flex-items-center-justify-center border border-[#2A342A] py-1 px-5 bg-[#181716] text-lg ${className}`}>
			<p className='w-5/6 mx-auto'>{gameName} Game</p>
		</button>
	);
}

interface LeaderBoardDetails {
	rank: number;
	topPercent: number;
	multiplier: number;
	name: string;
	points: number;
}

const leaderBoardDetails: LeaderBoardDetails[] = [
	{
		rank: 1,
		topPercent: 99.9,
		multiplier: 5,
		name: "0x7a3B4C5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B",
		points: 2345,
	},
	{
		rank: 2,
		topPercent: 99.5,
		multiplier: 4,
		name: "0x1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0",
		points: 2301,
	},
	{
		rank: 3,
		topPercent: 99.1,
		multiplier: 3,
		name: "0x2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1",
		points: 2287,
	},
	{
		rank: 4,
		topPercent: 98.7,
		multiplier: 2,
		name: "0x3F4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2",
		points: 2254,
	},
	{
		rank: 5,
		topPercent: 98.2,
		multiplier: 2,
		name: "0x4A5B6C7D8E9F0A1B2C3D4E5F6A7B8C9D0E1F2A3",
		points: 2198,
	},
	{
		rank: 6,
		topPercent: 97.8,
		multiplier: 2,
		name: "0x5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4",
		points: 2176,
	},
	{
		rank: 7,
		topPercent: 97.3,
		multiplier: 1,
		name: "0x6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5",
		points: 2145,
	},
	{
		rank: 8,
		topPercent: 96.9,
		multiplier: 1,
		name: "0x7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6",
		points: 2098,
	},
	{
		rank: 9,
		topPercent: 96.4,
		multiplier: 1,
		name: "0x8C9D0E1F2A3B4C5D6E7F8A9B0C1D2E3F4A5B6C7",
		points: 2067,
	},
	{
		rank: 10,
		topPercent: 95.9,
		multiplier: 1,
		name: "0x9E0F1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8",
		points: 2034,
	},
	{
		rank: 11,
		topPercent: 95.5,
		multiplier: 1,
		name: "0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B",
		points: 1998,
	},
	{
		rank: 12,
		topPercent: 95.0,
		multiplier: 1,
		name: "0xB3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C",
		points: 1965,
	},
	{
		rank: 13,
		topPercent: 94.5,
		multiplier: 1,
		name: "0xC5D6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D",
		points: 1932,
	},
	{
		rank: 14,
		topPercent: 94.1,
		multiplier: 1,
		name: "0xD7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E",
		points: 1901,
	},
	{
		rank: 15,
		topPercent: 93.6,
		multiplier: 1,
		name: "0xE9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F",
		points: 1876,
	},
];

function LeaderBoardCard() {
	const [interval, setInterval] = useState("today");

	function handleSelectInterval(interval: string): void {
		setInterval(interval);
	}
	return (
		<section className='w-full md:w-4/5 mx-auto text-white border border-[#2FFF2B80] p-4'>
			<div className='flex items-center justify-center gap-4 mb-6 mx-auto w-4/5 h-10'>
				<div className='w-1/2 h-full'>
					<select
						value={interval}
						onChange={(e) => {
							handleSelectInterval(e.target.value);
						}}
						className='bg-[#181716] border border-[#2A342A] h-full text-xl w-full px-2 outline-none'>
						<option value='today'>Today</option>
						<option value='weekly'>Weekly</option>
						<option value='monthly'>Monthly</option>
					</select>
				</div>
				{/* <GlowingTime
					time={{ hours: "04", minutes: "13", seconds: "20" }}
				/> */}
				<div className='w-1/2 border border-[#2A342A] bg-[#111411] h-full flex item-center justify-center p-1'>
					<p className='text-xl'>04: 13: 20</p>
				</div>
			</div>

			<div className='flex items-center justify-between mb-6'>
				{gameTypes.map((type, index) => (
					<GameCard
						gameName={type.title}
						key={index}
						className={type?.className}
					/>
				))}
			</div>

			<div className='w-full mx-auto bg-black/70 p-2'>
				<div className='grid grid-cols-4 justify-center w-full border-b border-white/50 pb-1 gap-2 mb-2'>
					<div className='w-full flex items-center justify-center'>
						<h2 className='text-md'>Rank</h2>
					</div>
					<div className='w-full flex items-center justify-center'>
						<h2 className='text-md'>Top% (Rewards)</h2>
					</div>
					<div className='w-full flex items-center justify-center'>
						<h2 className='text-md'>Name</h2>
					</div>
					<div className='w-full flex items-center justify-center'>
						<h2 className='text-md'>Points</h2>
					</div>
				</div>
				<div className=''>
					{[
						...leaderBoardDetails.slice(0, 8),
						...leaderBoardDetails.slice(-1),
					].map((detail, index, array) => (
						<RankRow
							detail={detail}
							key={index}
							isLast={index === array.length - 1}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

function RankRow({
	detail,
	isLast,
}: {
	detail: LeaderBoardDetails;
	isLast: boolean;
}) {
	return (
		<div
			className={`grid grid-cols-4 justify-center w-full py-3 gap-2 border-b border-[#2A342A] ${
				isLast ? "border border-[#2A342A] bg-[#013401]" : ""
			}`}>
			<div className='w-full flex items-center justify-center font-["satoshi"]'>
				<p>{detail.rank}</p>
			</div>
			<div className='w-full flex items-center justify-center font-["satoshi"]'>
				<p>
					<span>{Math.round(detail.topPercent)}%</span>{" "}
					<span>({detail.multiplier}x)</span>
				</p>
			</div>
			<div className='w-full flex items-center justify-center font-["satoshi"]'>
				<p className='text-sm'>
					{detail.name.slice(0, 4)}...
					{detail.name.slice(-4)}
				</p>
			</div>
			<div className='w-full flex items-center justify-center font-["satoshi"]'>
				<p>{detail.points}</p>
			</div>
		</div>
	);
}

export default LeaderBoardCard;
