import { ParticlesComponent } from "iw-particles";

export default function ParticlesBubble(props: {
  contrast?: string;
  primary?: string;
  hidden?: boolean;
}) {
  //   contrast = "#191919",
  //   primary = "#C2272D",

  const { primary, contrast, hidden } = props;
  return (
    <div
      className={`fixed bg-[${primary ?? "#C2272D"}] md:w-full w-[200%] h-auto aspect-square mask-radial-from-0 mask-radial-to-70% left-0 top-full -translate-x-1/2 -translate-y-1/3 overflow-hidden ${hidden ? "opacity-0 -translate-x-full" : ""} transition-all duration-2000`}
    >
      <ParticlesComponent id="gradient" color={contrast ?? "#191919"} />
    </div>
  );
}
