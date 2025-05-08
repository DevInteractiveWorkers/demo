import { Button } from "@/components/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-12 md:max-w-3xl max-w-full md:p-20">
      <h1 className="text-4xl pb-4 font-medium">
        DEMO <span className="font-bold">PORTFOLIO</span>
      </h1>
      <p className=" text-lg">
        If you are looking for alternatives to delegate regular assignments with
        the best options for your budget and with a satisfactory degree of
        results guaranteed, a VA is your best choice. Take a look at what you
        would get from your potential virtual team member.
      </p>
      <div className="flex pt-4 text-2xl gap-5">
        <Button src={"/play.png"}>WATCH VIDEO</Button>
        <Button src={"/pdf.png"}>RESUME</Button>
      </div>
    </div>
  );
}
