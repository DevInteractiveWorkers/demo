import Image from "next/image";

export const Navbar = () => {
  return (
    <div className="fixed top-0 pt-10 w-full flex justify-between md:px-25 px-12 pb-20">
      <Image
        src={"/InteractiveWorkers logo color-03.webp"}
        width={1080}
        height={1080}
        className="w-[200px]"
        alt="InteractiveWorkers"
      />
      <div className="flex items-center gap-2 cursor-pointer">
        <Image src="/toggle.png" width={50} height={50} alt="toggle" />
      </div>
    </div>
  );
};
