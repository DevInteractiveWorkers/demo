import "./headband.css";
import Image from "next/image";

type HeadbandProps = {
  name: string;
  position: string;
  visible?: boolean;
};

export default function Headband({ name, position, visible }: HeadbandProps) {
  return (
    <div
      className={`absolute left-0 bottom-0 m-10 flex items-center ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="bg-[#AE232D] md:p-4 p-2 rounded-full z-10 headband-logo">
        <Image
          src={"/logo/03_Logo_Mark/03_Logo_Mark-02.png"}
          alt={"logo"}
          width={1080}
          height={1080}
          className="w-full h-full md:max-w-30 max-w-20 aspect-square object-contain bg-white rounded-full md:p-4 p-2"
        />
      </div>
      <div className="absolute left-full w-max z-0 flex flex-col headbands">
        <HeadbandText
          index={1}
          className="md:text-5xl text-2xl"
          background="#AE232D"
        >
          <h2 className="name">{name}</h2>
        </HeadbandText>
        <HeadbandText
          index={2}
          className="md:text-2xl delay-2000"
          background="#DD272D"
        >
          <label className="name">{position}</label>
        </HeadbandText>
      </div>
    </div>
  );
}

type HeadbandTextProps = (
  | {
      name: string;
    }
  | { children: React.ReactNode }
) & {
  index: number;
  className?: string;
  background?: string;
};

const HeadbandText = ({
  index,
  className,
  background = "#DD272D",
  ...props
}: HeadbandTextProps) => {
  return (
    <span
      className={`w-max font-semibold md:py-2 py-1 md:pl-4 pl-2 md:pr-10 pr-5 rounded-r-full relative
      after:h-full after:rounded-full after:w-1/2 after:absolute
      after:top-0 after:left-0 after:-translate-x-1/2 after:-z-10
      z-10 reveal-band ${className}`}
      style={
        {
          "--delay": `${index * 0.5}s`,
          "--bg-color": background,
        } as React.CSSProperties
      }
    >
      {"children" in props ? props.children : props.name}
    </span>
  );
};
