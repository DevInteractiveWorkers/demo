"use client";

import { FormEvent, useEffect, useState } from "react";
import { getPositions } from "@/lib/firestore";
import Input from "./admin/input/input";
import Button from "./admin/button";

type FormData = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  linkedinUrl: string;
  position: string[];
  inquiry: string;
};

type PositionOption = {
  name: string;
  value: string;
};

export default function RequestDemoForm() {
  const [positions, setPositions] = useState<PositionOption[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const initialForm: FormData = {
    name: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    linkedinUrl: "",
    position: [],
    inquiry: "",
  };

  const [form, setForm] = useState<FormData>(initialForm);

  useEffect(() => {
    getPositions().then((data) => {
      setPositions(
        data.map((position) => ({
          name: position.name,
          value: position.id,
        })),
      );
    });
  }, []);

  const handleForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePositionSelect = (option: { name: string; value: string }) => {
    setForm((prev) => ({
      ...prev,
      position: prev.position.includes(option.value)
        ? prev.position
        : [...prev.position, option.value],
    }));
  };

  const handlePositionRemove = (option: { name: string; value: string }) => {
    setForm((prev) => ({
      ...prev,
      position: prev.position.filter((id) => id !== option.value),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSending(true);
    setMessage(null);

    try {
      const selectedPositionNames = form.position
        .map((id) => positions.find((position) => position.value === id)?.name)
        .filter(Boolean);

      const response = await fetch("/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          position: selectedPositionNames,
          submittedAt: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      setSuccess(true);
      setMessage("Your demo request has been sent successfully!");
      setForm(initialForm);
    } catch {
      setSuccess(false);
      setMessage("Failed to send your request. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="md:p-10 px-2 py-10 w-full mx-2 grid justify-items-center gap-4
      border rounded-2xl border-[#292929] z-10 md:max-w-3xl
      bg-linear-0 from-[#191919] to-[#292929]
      inset-shadow-[0_-10px_10px_5px_#191919] backdrop-blur-2xl"
    >
      <h2 className="text-2xl font-medium">Speak with us</h2>

      <p className="text-sm text-white/50 text-center">
        Let us know your needs so we can match you with trained VAs that fit
        your goals and workflow.
      </p>

      <div className="grid md:grid-cols-2 gap-4 w-full">
        <Input
          placeholder="Name"
          example="John"
          value={form.name}
          required
          onChange={(e) => handleForm("name", e.target.value)}
        />

        <Input
          placeholder="Last Name"
          example="Doe"
          value={form.lastName}
          required
          onChange={(e) => handleForm("lastName", e.target.value)}
        />
      </div>

      <Input
        placeholder="Email"
        type="email"
        example="you@company.com"
        value={form.email}
        required
        onChange={(e) => handleForm("email", e.target.value)}
      />

      <Input
        placeholder="Phone"
        example="+1 (555) 123-4567"
        value={form.phone}
        required
        onChange={(e) => handleForm("phone", e.target.value)}
      />

      <Input
        placeholder="Company Name"
        example="Your company or business name"
        value={form.companyName}
        required
        onChange={(e) => handleForm("companyName", e.target.value)}
      />

      <Input
        placeholder="LinkedIn Profile"
        example="https://www.linkedin.com/company/your-company"
        value={form.linkedinUrl}
        required
        onChange={(e) => handleForm("linkedinUrl", e.target.value)}
      />

      <Input
        placeholder="Position(s) of interest"
        type="select"
        multiple
        options={positions}
        selected={form.position}
        example="Select one or more positions"
        required
        onSelect={handlePositionSelect}
        onRemove={handlePositionRemove}
      />

      <Input
        type="textarea"
        placeholder="Inquiry"
        example="What would you like help with? (e.g. admin tasks, customer support)"
        value={form.inquiry}
        required
        onChange={(e) => handleForm("inquiry", e.target.value)}
      />

      {message && (
        <p className={success ? "text-green-400" : "text-[#DD272D]"}>
          {message}
        </p>
      )}

      <p className="text-xs text-center">
        Messages and data rates may apply. Message frequency will vary. Reply
        STOP to opt out of messaging.
      </p>

      <Input
        type="checkbox"
        required
        label={
          <>
            I agree with the{" "}
            <a
              href="https://interactiveworkers.com/policy"
              className="text-[#C2272D] hover:underline"
            >
              Privacy Policy
            </a>
            .
          </>
        }
      />

      <Button disabled={sending}>
        {sending ? "Sending..." : "Request Demo"}
      </Button>
    </form>
  );
}
