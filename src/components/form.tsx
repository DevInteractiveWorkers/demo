import { ParticlesComponent } from "iw-particles";
import { FormEventHandler } from "react";
import { IconButton } from "./icons/icon-button";
import ParticlesBubble from "./particles-bubble";

export type FormProps = {
  isOpen?: boolean;
  toggleClose?: () => void;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  background?: string;
};

export default function Form({
  children,
  isOpen,
  toggleClose,
  onSubmit,
  background,
}: { children: React.ReactNode } & FormProps) {
  return (
    <div
      className={
        background ??
        `absolute top-0 left-0 w-full h-dvh flex items-center justify-center bg-[#191919]/50 backdrop-blur-lg transition-all duration-500 overflow-y-hidden 
        ${isOpen !== undefined ? `fixed top-0 left-0 ${isOpen ? "opacity-100 z-50" : "opacity-0 -z-50"}` : ""}`
      }
    >
      {toggleClose && (
        <IconButton
          icon={"close"}
          viewBox="0 0 25 25"
          className="absolute top-0 right-0"
          onClick={toggleClose}
        />
      )}

      <ParticlesBubble />
      <form
        onSubmit={onSubmit}
        className="md:p-10 px-4 py-10 w-full md:max-w-xl sm:max-w-9/12 max-w-11/12 mx-2 grid justify-items-center gap-4
        border rounded-2xl border-[#292929] absolute z-10
        bg-linear-0 from-[#191919] to-[#292929] inset-shadow-[0_-10px_10px_5px_#191919] backdrop-blur-2xl"
      >
        {children}
      </form>
    </div>
  );
}
