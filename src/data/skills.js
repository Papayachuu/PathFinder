import { Stethoscope, Waves, FlaskConical, BookOpen, MessagesSquare, FileCheck } from "lucide-react";

export const SKILLS = [
  { id: "clinical", label: "Clinical Practice", short: "Clinical", icon: Stethoscope, desc: "Nadi pariksha, diagnosis, patient examination" },
  { id: "panchakarma", label: "Panchakarma & Therapeutics", short: "Panchakarma", icon: Waves, desc: "Detox and therapeutic procedure protocols" },
  { id: "pharma", label: "Pharma & Drug Standardization", short: "Pharma", icon: FlaskConical, desc: "Dravyaguna, formulation, GMP/QC" },
  { id: "research", label: "Classical Texts & Research", short: "Research", icon: BookOpen, desc: "Samhita interpretation, research methodology" },
  { id: "communication", label: "Patient Communication", short: "Communication", icon: MessagesSquare, desc: "Counseling and case history taking" },
  { id: "digital", label: "Digital Health & Regulatory", short: "Digital & Regulatory", icon: FileCheck, desc: "EHR systems, AYUSH licensing and compliance" },
];
