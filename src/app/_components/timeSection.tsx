import CompetitionTimer from "@/components/competitionTimer";
import CompetitionCountdown from "@/components/competitionCountdown";
import { Competition } from "@prisma/client";

export default function TimeSection({
  latestCompetition,
}: {
  latestCompetition: Competition | null;
}) {
  return (
    <section
      className="bg-[#111411] border-[#03B500] border p-4"
      style={{
        clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0 100%, 0 18%)",
      }}
    >
      <p className="text-white text-center text-2xl mb-4">
        Guess the correct crypto personality and win rewards!
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        {/* <CompetitionTimer competition={latestCompetition} /> */}
        <CompetitionCountdown competition={latestCompetition} />
      </div>
    </section>
  );
}
