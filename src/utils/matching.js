import { SKILLS } from "../data/skills.js";

export const STAGES = [
  "Applied",
  "Under review",
  "Shortlisted",
  "Selected",
];

export const skillById = (id) => SKILLS.find((s) => s.id === id);

/**
 * Computes a 0-100 match score between a posting's required skills
 * and a candidate's self-assessed / recorded skill scores.
 *
 * Each required skill contributes:
 * min(candidateScore / requiredLevel, 1)
 *
 * The result is averaged across all required skills.
 */
export function matchScore(requiredSkills, scores) {
  if (!requiredSkills || !requiredSkills.length) return 0;

  const total = requiredSkills.reduce(
    (sum, skill) =>
      sum + Math.min((scores?.[skill.cat] || 0) / skill.level, 1),
    0
  );

  return Math.round((total / requiredSkills.length) * 100);
}

/**
 * Provides a detailed breakdown of a candidate's skill match.
 *
 * Returns:
 * - overall score
 * - matched skills
 * - missing / weak skills
 * - per-skill percentage
 */
export function matchDetails(requiredSkills, scores = {}) {
  if (!requiredSkills || !requiredSkills.length) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
      skillBreakdown: [],
    };
  }

  const skillBreakdown = requiredSkills.map((skill) => {
    const candidateScore = scores?.[skill.cat] || 0;
    const requiredLevel = skill.level || 1;

    const percentage = Math.round(
      Math.min(candidateScore / requiredLevel, 1) * 100
    );

    const skillInfo = skillById(skill.cat);

    return {
      id: skill.cat,
      name: skillInfo?.label || skill.cat,
      candidateScore,
      requiredLevel,
      percentage,
    };
  });

  const matchedSkills = skillBreakdown.filter(
    (skill) => skill.percentage >= 70
  );

  const missingSkills = skillBreakdown.filter(
    (skill) => skill.percentage < 70
  );

  const score = Math.round(
    skillBreakdown.reduce(
      (total, skill) => total + skill.percentage,
      0
    ) / skillBreakdown.length
  );

  return {
    score,
    matchedSkills,
    missingSkills,
    skillBreakdown,
  };
}