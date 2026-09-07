import { ClipboardCheck, Target, Send, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Assess",
    desc: "A short skill assessment builds your profile across the areas Ayurveda employers look for.",
  },
  {
    icon: Target,
    title: "Match",
    desc: "Internships, jobs and learning programs are ranked against your actual skill profile.",
  },
  {
    icon: Send,
    title: "Apply",
    desc: "Apply directly and track every application through review to selection.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    desc: "Certifications and experience are recorded in one verified digital portfolio.",
  },
];

export default function HowItWorks() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={s.title} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="as-badge-accent w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Icon size={15} />
              </span>
              <span className="as-muted text-xs">Step {i + 1}</span>
            </div>
            <div className="font-semibold text-sm">{s.title}</div>
            <p className="as-muted text-sm leading-relaxed">{s.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
