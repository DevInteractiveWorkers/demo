// components/Alert.tsx
"use client";

import Button from "../admin/button";
import { IconButton } from "../icons/icon-button";
import AlertIcon from "./alert-icon";
import { useState } from "react";

export type AlertProps = {
  title?: string;
  message?: string | React.ReactNode;
  icon?: "info" | "warning" | "success";
  description?: string;
  form?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function Alert({
  title = "Alert!",
  message,
  icon,
  form,
  description,
  onCancel,
  onConfirm,
}: AlertProps) {
  const [closing, setClosing] = useState(false);

  const handleCancel = () => {
    setClosing(true);

    setTimeout(() => {
      onCancel?.();
    }, 300); // match your CSS animation duration
  };

  const handleConfirm = () => {
    setClosing(true);

    setTimeout(() => {
      onConfirm?.();
    }, 300);
  };

  return (
    <section
      className={`absolute top-0 left-0 w-full h-full z-100 p-4 flex justify-center items-center bg-black/40 backdrop-blur-xs ${
        closing ? "alert-out" : "alert-in"
      }`}
    >
      <div className="relative bg-[#191919] rounded-xl border border-[#292929]">
        {onCancel && (
          <IconButton
            icon="close"
            onClick={handleCancel}
            className="absolute top-0 right-0"
            width={50}
            height={50}
          />
        )}
        <div className="text-white w-full md:max-w-3xl md:min-w-xl z-10">
          {form ?? (
            <form className="w-full grid gap-4 md:p-10 p-4">
              {icon && (
                <div className="w-full flex justify-center">
                  <AlertIcon icon={icon} />
                </div>
              )}
              <h1 className="md:text-5xl sm:text-4xl text-3xl text-center font-medium">
                {title}
              </h1>
              {description && <h2>{description}</h2>}

              <p>{message}</p>

              <div className="flex gap-4 w-full justify-center font-semibold">
                <Button type="button" onClick={handleConfirm}>
                  Continue
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
