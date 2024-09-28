"use client";

import Container from "@/components/layout/container";
import TimerDisplay from "@/components/ui/timeDisplay";
import Trapezoid from "@/components/ui/trapezoid";
import LeaderboardContainer from "./leaderboardContainer";

export default function LeaderBoardClient({}) {
	return (
		<Container className='sm:max-w-[700px] h-full'>
			<Trapezoid className='p-4'>
				<LeaderboardContainer />
			</Trapezoid>
		</Container>
	);
}
