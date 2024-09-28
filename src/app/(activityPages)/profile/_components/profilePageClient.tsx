"use client";

import React, { PureComponent } from "react";
import Trapezoid from "@/components/ui/trapezoid";
import Image from "next/image";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

type UserProps = {
	walletAddress: string;
	name: string;
	pfp: string;
	points: number;
	quests?: string[];
};

export default function ProfileClient({
	walletAddress = "0x1234567890123456789012345678901234567890",
	name = "john doe",
	pfp,
	points = 750,
	quests = ["quest 1", "quest 2"],
}: UserProps) {
	return (
		<Trapezoid
			slantedEdges={{
				top: true,
				right: false,
				bottom: true,
				left: false,
			}}
			slantAmount={30}
			fill='#111411'
			className='w-full max-w-[450px] text-white p-8 mx-auto relative'>
			<div>
				<div className='flex items-center mb-4 gap-3'>
					<div className='w-16 h-16 bg-[#032803] rounded-full flex items-center overflow-hidden border-2 border-white justify-center'>
						{pfp ? (
							<Image
								src={pfp}
								alt='pfp'
								width={40}
								height={40}
								className='object-cover'
							/>
						) : (
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 24 24'
								fill='currentColor'
								className='size-full'>
								<path
									fillRule='evenodd'
									d='M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z'
									clipRule='evenodd'
								/>
							</svg>
						)}
					</div>
					<div>
						<h2 className='text-xl font-semibold capitalize mb-1'>
							{name}
						</h2>
						<p className='text-sm text-gray-400'>
							{walletAddress.slice(0, 5)}...
							{walletAddress.slice(-4)}
						</p>
					</div>
					<Trapezoid
						fill='#181716'
						stroke='#2A342A'
						strokeWidth={4}
						slantAmount={60}
						slantedEdges={{
							top: false,
							right: false,
							bottom: true,
							left: false,
						}}
						className='ml-auto w-[65px] h-[68px] p-3 bg-[#181716] text-center'>
						<p className='text-xl font-bold mb-2'>{points}</p>
						<p className='text-sm text-white/70 leading-none'>
							Total points
						</p>
					</Trapezoid>
				</div>
				<div className='mb-6 border border-[#2A342A] bg-[#181716] w-full flex pt-2 h-[209px] items-center justify-center'>
					<div className='w-11/12 mx-auto h-4/5 relative border-l border-b border-white/5'>
						<p className='absolute top-0 left-0 text-sm text-white/50 transform -translate-y-full'>
							Rank
						</p>
						<p className='absolute bottom-0 right-0 text-sm text-white/50 transform translate-y-full'>
							Date
						</p>
						<Example />
					</div>
				</div>
				<Trapezoid
					stroke='#2A342A'
					fill='#181716'
					strokeWidth={2}
					slantedEdges={{
						top: true,
						right: false,
						bottom: true,
						left: false,
					}}
					slantAmount={30}
					className='text-white p-3'>
					<h3 className='text-xl font-semibold mb-3'>Quests</h3>
					{quests?.length > 0 ? (
						quests?.map((quest, index) => (
							<button
								key={index}
								className='bg-[#33333380] py-2 rounded mb-2 hover:bg-[#2A342A] block text-center w-full transition-colors duration-300'>
								<p className='text-lg text-center capitalize'>
									{quest}
								</p>
							</button>
						))
					) : (
						<p className='text-center text-white/50'>
							No quests yet
						</p>
					)}
				</Trapezoid>
			</div>
		</Trapezoid>
	);
}

const data = [
	{
		name: "Page A",
		uv: 4000,
		pv: 2400,
		amt: 2400,
	},
	{
		name: "Page B",
		uv: 3000,
		pv: 1398,
		amt: 2210,
	},
	{
		name: "Page C",
		uv: 2000,
		pv: 9800,
		amt: 2290,
	},
	{
		name: "Page D",
		uv: 2780,
		pv: 3908,
		amt: 2000,
	},
	{
		name: "Page E",
		uv: 1890,
		pv: 4800,
		amt: 2181,
	},
	{
		name: "Page F",
		uv: 2390,
		pv: 3800,
		amt: 2500,
	},
	{
		name: "Page G",
		uv: 3490,
		pv: 4300,
		amt: 2100,
	},
];

//Please don't try changing this to a functional component, it won't work that way
class Example extends PureComponent {
	render() {
		return (
			<ResponsiveContainer
				width='100%'
				height='100%'>
				<LineChart
					width={500}
					height={300}
					data={data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}>
					<Tooltip
						contentStyle={{
							backgroundColor: "#2a2a2a",
							border: "1px solid #444",
							borderRadius: "4px",
							boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
						}}
					/>
					<CartesianGrid
						vertical={false}
						strokeDasharray='3 3'
					/>
					<Line
						type='monotone'
						dataKey='pv'
						stroke='#8884d8'
						activeDot={{ r: 8 }}
					/>
					<Line
						type='monotone'
						dataKey='uv'
						stroke='#82ca9d'
					/>
				</LineChart>
			</ResponsiveContainer>
		);
	}
}
