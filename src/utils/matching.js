import { SKILLS } from "../data/skills.js";

export const STAGES = ["Applied", "Under review", "Shortlisted", "Selected"];

export const skillById = (id) => SKILLS.find((s) => s.id === id);

/**
 * Computes a 0-100 match score between a posting's required skills
 * and a candidate's self-assessed / recorded skill scores.
 * Each required skill contributes min(candidateScore / requiredLevel, 1),
 * averaged across all required skills.
 */
export function matchScore(requiredSkills, scores) {
  if (!requiredSkills || !requiredSkills.length) return 0;
  const total = requiredSkills.reduce(
    (sum, r) => sum + Math.min((scores[r.cat] || 0) / r.level, 1),
    0
  );
  return Math.round((total / requiredSkills.length) * 100);
}
