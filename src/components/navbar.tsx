import Image from "next/image";
import Link from "next/link";

export const Navbar = ({
  fixed = false,
  hide = false,
}: {
  fixed?: boolean;
  hide?: boolean;
}) => {
  return (
    <nav
      className={`group z-50 ${fixed && "absolute top-0 left-0 w-full h-1/8 "}`}
    >
      <div
        className={`w-full flex justify-between items-center md:px-25 px-12 pb-20 md:pt-10 pt-6 transition-transform duration-300 ${
          fixed
            ? `fixed top-0 left-0 z-50 ${hide && "-translate-y-full group-hover:translate-y-0"}`
            : ""
        }`}
      >
        <Link href="https://interactiveworkers.com/" target="_blank">
          <Image
            src="/logo/01_Primary_Logo/Primary_Logo-04.png"
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
    </nav>
  );
};
