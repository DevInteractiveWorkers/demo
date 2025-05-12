import Image from "next/image";

export const Navbar = ({ fixed = false }: { fixed?: boolean }) => {
  return (
    <div
      className={`md:pt-10 pt-6 w-full flex justify-between md:px-25 px-12 pb-20 ${
        fixed && "fixed top-0 "
      }`}
    >
      <Image
        src={"/InteractiveWorkers logo color-03.webp"}
        width={1080}
        height={1080}
        className="w-[200px]"
        alt="InteractiveWorkers"
      />
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
