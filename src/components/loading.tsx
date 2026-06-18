import Image from "next/image";

const Loading = () => {
  return (
    <Image
      src={"/logo/03_Logo_Mark/03_Logo_Mark-01.png"}
      alt={"InteractiveWorkers"}
      width={1080}
      height={1080}
      className="max-w-40 animate-loading-flip"
    />
  );
};

const LoadingPage = () => {
  return (
    <div className="w-full h-full max-h-svh flex items-center justify-center">
      <Loading />
    </div>
  );
};

export { Loading, LoadingPage };
