import Image from "next/image";

export const Button = ({
  src,
  children = "",
}: {
  src: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <Image src={src} width={50} height={50} alt={""} />
      {children}
    </div>
  );
};
