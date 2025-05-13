import Image from "next/image";
import Link from "next/link";

export const Navbar = ({ fixed = false }: { fixed?: boolean }) => {
  return (
    <div
      className={`md:pt-10 pt-6 w-full flex justify-between items-center z-50 md:px-25 px-12 pb-20 ${
        fixed && "fixed top-0 "
      }`}
    >
      <Link href={"https://interactiveworkers.com/"} target="blank">
        <Image
          src={"/InteractiveWorkers logo color-03.webp"}
          width={1080}
          height={1080}
          className="w-[200px] cursor-pointer"
          alt="InteractiveWorkers"
        />
      </Link>
      <div className="cursor-pointer">
        <Image
          src="/toggle.png"
          width={50}
          height={50}
          alt="toggle"
          className="h-auto"
        />
      </div>
    </div>
  );
};
