"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import toast from "react-hot-toast";
import axios from "@/lib/axios";
import { useAuth } from "@/context/authContext";

type ContactErrors = Partial<Record<"email" | "subject" | "message", string>>;

export default function ContactPage() {
  const { currentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser?.email) setEmail(currentUser.email);
  }, [currentUser?.email]);

  const validate = () => {
    const nextErrors: ContactErrors = {};
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!trimmedSubject) nextErrors.subject = "Subject is required.";
    else if (trimmedSubject.length > 150) nextErrors.subject = "Subject must be 150 characters or fewer.";
    if (!trimmedMessage) nextErrors.message = "Message is required.";
    else if (trimmedMessage.length > 10000) nextErrors.message = "Message must be 10000 characters or fewer.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);
    try {
      await axios.post("/contact", {
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success("Your message was sent to InternHub.");
      setSubject("");
      setMessage("");
      setErrors({});
    } catch (error) {
      console.error("Failed to send contact message", error);
      toast.error("We couldn’t send your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldError = (field: keyof ContactErrors) => errors[field] && (
    <p className="mt-1 text-sm text-red-600" role="alert">{errors[field]}</p>
  );

  return (
    <main className="min-h-[75vh] bg-slate-50 px-5 py-12 sm:px-8 lg:py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="flex flex-col justify-center">
          <Link href="/" className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <div className="mb-5 inline-flex w-fit rounded-xl bg-orange-100 p-3 text-orange-600">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900">Contact InternHub</h1>
          <p className="mt-4 max-w-md leading-7 text-slate-600">
            Send us a question, share feedback, or tell us how we can improve. Your message will be sent to the InternHub team.
          </p>
        </section>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined })); }}
              className={`w-full rounded-md border px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-200 ${errors.email ? "border-red-500" : "border-slate-300"}`}
              placeholder="you@example.com"
              required
            />
            {fieldError("email")}
          </div>
          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-semibold text-slate-700">Subject</label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              maxLength={150}
              onChange={(event) => { setSubject(event.target.value); setErrors((current) => ({ ...current, subject: undefined })); }}
              className={`w-full rounded-md border px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-200 ${errors.subject ? "border-red-500" : "border-slate-300"}`}
              placeholder="How can we help?"
              required
            />
            {fieldError("subject")}
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm font-semibold text-slate-700">Message</label>
            <textarea
              id="contact-message"
              value={message}
              maxLength={10000}
              rows={7}
              onChange={(event) => { setMessage(event.target.value); setErrors((current) => ({ ...current, message: undefined })); }}
              className={`w-full resize-y rounded-md border px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-200 ${errors.message ? "border-red-500" : "border-slate-300"}`}
              placeholder="Write your message..."
              required
            />
            {fieldError("message")}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-5 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </main>
  );
}
