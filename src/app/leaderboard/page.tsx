import Image from "next/image";
import LeaderBoardCard from "./_components/LeaderBoardCard";
import Link from "next/link";
import Container from "@/components/layout/container";
import { ReactNode } from "react";

export default function LeaderBoard() {
	return (
		<Container>
			<div className='w-full flex items-center justify-between mb-8 mt-4'>
				<div>
					<button className='text-white bg-[#013401] border border-[#30D212] px-6 md:px-10 py-1 text-lg font-medium'>
						Play
					</button>
				</div>
				<div className='bg-[#013401] px-6 md:px-10 py-3 flex items-center justify-center border border-[#30D212]'>
					<h1 className='text-4xl text-white font-semibold'>
						LeaderBoard
					</h1>
				</div>
				<div>
					<button className='text-white bg-[#013401] border border-[#30D212] px-6 md:px-10 py-1 text-lg font-medium'>
						Options
					</button>
				</div>
			</div>
			<LeaderBoardCard />
		</Container>
	);
}
