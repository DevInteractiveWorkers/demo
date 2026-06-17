"use client";

import Input from "@/components/admin/input/input";
import Form from "@/components/form";
import Button from "./admin/button";
import { FormEvent, useEffect, useState } from "react";

type FormData = {
  name: string;
  email: string;
  issue: string;
  description: string;
  url: string;
};

export default function SupportForm() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [referrer, setReferrer] = useState("");

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    issue: "",
    description: "",
    url: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
      setReferrer(document.referrer);
    }
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Sent to support ", form);
  };

  return (
    <Form
      onSubmit={(e) => handleSubmit(e)}
      background="absolute top-0 left-0 w-full h-dvh flex items-center justify-center"
    >
      <h2 className="text-2xl font-medium">Contact Support</h2>

      <p className="text-sm text-white/50 text-center max-w-md">
        Experiencing an issue? Tell us what happened and our team will
        investigate it as soon as possible.
      </p>

      <Input
        required
        placeholder="Your Name"
        example="John Doe"
        value={form.name}
        onChange={(e: any) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        required
        type="email"
        placeholder="Email Address"
        example="your@company.com"
        value={form.email}
        onChange={(e: any) => setForm({ ...form, email: e.target.value })}
      />

      <Input
        required
        type="select"
        placeholder="Issue Type"
        example="Select an issue"
        options={[
          { name: "Broken Link", value: "broken-link" },
          { name: "Broken Video", value: "broken-video" },
          { name: "Broken PDF", value: "broken-pdf" },
          { name: "Incorrect Information", value: "incorrect-info" },
          { name: "Other", value: "other" },
        ]}
        selected={form.issue}
        onSelect={(option) => setForm({ ...form, issue: option.value })}
      />

      <Input
        required
        type="textarea"
        placeholder="Describe the issue"
        example={
          form.issue === "broken-video"
            ? "The video isn't loading ."
            : form.issue === "broken-pdf"
              ? "The resume doesn't appear when I click on the resume link."
              : form.issue === "broken-link"
                ? "The demo page shows a 404 error."
                : "e.g. demo.interactiveworkers.com/general-va/john-doe link is not working"
        }
        value={form.description}
        onChange={(e: any) => setForm({ ...form, description: e.target.value })}
      />

      {/* Conditional field */}
      {form.issue && (
        <Input
          placeholder={`${
            form.issue === "broken-video"
              ? "Video URL or timestamp"
              : form.issue === "broken-pdf"
                ? "PDF URL"
                : form.issue === "broken-link"
                  ? "Broken Link URL"
                  : "Related URL"
          } (recommended)`}
          example={
            form.issue === "broken-video"
              ? "https://demo.interactiveworkers.com/... or 01:24"
              : currentUrl
          }
          value={form.url}
          onChange={(e: any) => setForm({ ...form, url: e.target.value })}
        />
      )}

      <Button>Send Support Request</Button>
    </Form>
  );
}
