import "./loading.css";
import Image from "next/image";

const Loader = () => {
  return (
    <svg
      className="loader"
      viewBox="0 0 384 384"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="active"
        pathLength="360"
        fill="transparent"
        strokeWidth="32"
        cx="192"
        cy="192"
        r="176"
      ></circle>
      <circle
        className="track"
        pathLength="360"
        fill="transparent"
        strokeWidth="32"
        cx="192"
        cy="192"
        r="176"
      ></circle>
    </svg>
  );
};

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

export { Loader, Loading, LoadingPage };
