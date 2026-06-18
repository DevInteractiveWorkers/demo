"use client";

import Input from "./admin/input/input";
import { useEffect, useState } from "react";
import { getPositions } from "@/lib/firestore";
import Button from "./admin/button";

export default function RequestDemoForm() {
  const [positions, setPositions] = useState<any[]>([]);

  const [form, setForm] = useState<{
    name: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    linkedinUrl: string;
    position: string | string[];
    inquiry: string;
  }>({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    linkedinUrl: "",
    position: "",
    inquiry: "",
  });

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

  const handleForm = ([item]: string, value: string) => {
    setForm({ ...form, [item]: value });
  };

  const handlePositionSelect = (option: { name: string; value: string }) => {
    setForm((prev) => ({
      ...prev,
      position: Array.isArray(prev.position)
        ? prev.position.includes(option.value)
          ? prev.position
          : [...prev.position, option.value]
        : [option.value],
    }));
  };

  const handlePositionRemove = (option: { name: string; value: string }) => {
    setForm((prev) => ({
      ...prev,
      position: Array.isArray(prev.position)
        ? prev.position.filter((id) => id !== option.value)
        : [],
    }));
  };

  return (
    <form
      className="md:p-10 px-2 py-10 w-full mx-2 grid justify-items-center gap-4
        border rounded-2xl border-[#292929] z-10 md:max-w-3xl
        bg-linear-0 from-[#191919] to-[#292929] inset-shadow-[0_-10px_10px_5px_#191919] backdrop-blur-2xl"
    >
      <h2 className="text-2xl font-medium">Speak with us</h2>
      <p className="text-sm text-white/50 text-center">
        Let us know your needs - So we match you with trained VAs that fit your
        goals and workflow.
      </p>
      <div className="grid md:grid-cols-2 gap-4 w-full">
        <Input
          placeholder="Name"
          example="John"
          required
          onChange={(e) => handleForm("name", e.target.value)}
        />
        <Input
          placeholder="Last Name"
          example="Doe"
          required
          onChange={(e) => handleForm("lastName", e.target.value)}
        />
      </div>
      <Input
        placeholder="Email"
        type="email"
        example="you@company.com"
        required
        onChange={(e) => handleForm("email", e.target.value)}
      />
      <Input placeholder="Phone" example="+1 (555) 123-4567" required />
      <Input
        placeholder="Company Name"
        onChange={(e) => handleForm("companyName", e.target.value)}
        example="Your company or businnes name"
        required
      />
      <Input
        placeholder="LinkedIn Profile"
        onChange={(e) => handleForm("linkedinUrl", e.target.value)}
        example="https://www.linkedin.com/company/your-company"
        required
      />
      <Input
        placeholder="Position(s) of interest"
        type="select"
        multiple
        selected={Array.isArray(form.position) ? form.position : []}
        options={positions}
        example="Select one or more positions"
        required
        onSelect={handlePositionSelect}
        onRemove={handlePositionRemove}
      />
      <Input
        type="textarea"
        placeholder="Inquiry"
        onChange={(e) => handleForm("inquiry", e.target.value)}
        example="What would you like help with? (e.g. admin tasks, customer support)"
        required
      />
      <p className="text-xs">
        Messages and data rates may apply. Message frequency will vary. Reply
        STOP to opt-out of messaging.
      </p>
      <Input
        type="checkbox"
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
        required
      />
      <Button>Request Demo</Button>
    </form>
  );
}
