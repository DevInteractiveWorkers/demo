import Image from "next/image";
import { Button } from "./button";

export const Navbar = () => {
  return (
    <div className="fixed pt-10 w-full flex justify-between md:px-25 px-12">
      <Image
        src={"/InteractiveWorkers logo color-03.webp"}
        width={1080}
        height={1080}
        className="w-[200px]"
        alt="InteractiveWorkers"
      />
      <Button src="/toggle.png" />
    </div>
  );
};
