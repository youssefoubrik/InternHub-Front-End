import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Building2, GraduationCap } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "For students",
    text: "Discover internships, apply with your profile, and follow each application as it moves through review.",
  },
  {
    icon: Building2,
    title: "For companies",
    text: "Share opportunities, review applicants, and manage your hiring process from one place.",
  },
  {
    icon: BriefcaseBusiness,
    title: "A clearer process",
    text: "InternHub brings students and employers together with a simple, transparent internship workflow.",
  },
];

export default function AboutUsPage() {
  return (
    <main className="min-h-[70vh] bg-slate-50">
      <section className="bg-slate-950 px-5 py-20 text-white sm:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">About InternHub</p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Helping students take the next step into their careers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            InternHub connects students looking for practical experience with companies ready to welcome new talent.
            We make it easier to discover opportunities, apply, and keep track of what happens next.
          </p>
          <Link href="/internships" className="mt-8 inline-flex items-center gap-2 rounded-md bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600">
            Browse internships <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900">One place to connect and move forward</h2>
          <p className="mt-4 leading-7 text-slate-600">
            Finding an internship and finding the right candidate both take time. InternHub gives students and companies a shared space to make that process easier to follow.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {audiences.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 inline-flex rounded-lg bg-orange-50 p-3 text-orange-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-5 py-14 text-center sm:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Have a question or suggestion?</h2>
        <p className="mt-3 text-slate-600">We’d be glad to hear from you.</p>
        <Link href="/contact" className="mt-5 inline-flex rounded-md border border-orange-500 px-5 py-2.5 font-semibold text-orange-600 hover:bg-orange-50">
          Contact InternHub
        </Link>
      </section>
    </main>
  );
}
