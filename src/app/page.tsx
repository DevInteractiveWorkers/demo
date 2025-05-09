import { Button } from "@/components/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="lg:max-w-3xl md:w-1/2 max-w-full flex flex-col gap-5">
        <h1 className="text-4xl pb-4 font-medium  md:px-25 px-12">
          DEMO <span className="font-bold">PORTFOLIO</span>
        </h1>
        <p className="text-lg bg-[#C1272D] md:px-25 px-12 py-5 rounded-r-full">
          If you are looking for alternatives to delegate regular assignments
          with the best options for your budget and with a satisfactory degree
          of results guaranteed, a VA is your best choice. Take a look at what
          you would get from your potential virtual team member.
        </p>
        <div className="flex pt-4 text-2xl gap-5 max-sm:flex-col  md:px-25 px-12">
          <Button src={"/play.png"}>WATCH VIDEO</Button>
          <Button src={"/pdf.png"}>RESUME</Button>
        </div>
      </div>
      <Image
        src={"/hero.png"}
        width={1080}
        height={1080}
        className="absolute right-0 bottom-0 w-1/2 xl:w-6/12 max-lg:hidden"
        alt="InteractiveWorkers"
      />
    </>
  );
}
