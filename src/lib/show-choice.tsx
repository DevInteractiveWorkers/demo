"use client";

import { createRoot } from "react-dom/client";
import Alert from "@/components/alerts/alert";
import AlertIcon from "@/components/alerts/alert-icon";
import Button from "@/components/admin/button";

export type Choice<T extends string> = {
  label: string;
  value: T;
  /** Renders the secondary (dark) button style. */
  dark?: boolean;
};

/**
 * Like `showAlert`, but with several labelled buttons.
 * Resolves with the chosen value, or `null` when dismissed with the X.
 */
export function showChoice<T extends string>(options: {
  title: string;
  icon?: "info" | "warning" | "success";
  message: React.ReactNode;
  choices: Choice<T>[];
}): Promise<T | null> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const finish = (value: T | null) => {
      root.unmount();
      container.remove();
      resolve(value);
    };

    root.render(
      <Alert
        onCancel={() => finish(null)}
        form={
          <form className="w-full grid gap-4 md:p-10 p-4">
            {options.icon && (
              <div className="w-full flex justify-center">
                <AlertIcon icon={options.icon} />
              </div>
            )}
            <h1 className="md:text-4xl text-3xl text-center font-medium">
              {options.title}
            </h1>
            <div className="grid gap-2">{options.message}</div>
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center font-semibold">
              {options.choices.map((choice) => (
                <Button
                  key={choice.value}
                  type="button"
                  dark={choice.dark}
                  onClick={() => finish(choice.value)}
                >
                  {choice.label}
                </Button>
              ))}
            </div>
          </form>
        }
      />,
    );
  });
}
