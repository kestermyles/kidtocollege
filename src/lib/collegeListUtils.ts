export type Category = "reach" | "target" | "safety" | "unknown";

interface CollegeAdmissionData {
  acceptanceRate: number | null;
  avgGpa: number | null;
  avgSat: number | null;
}

interface StudentProfile {
  gpa: number | null;
  sat: number | null;
  act: number | null;
}

export function categoriseCollege(
  college: CollegeAdmissionData,
  student: StudentProfile
): Category {
  if (!college.acceptanceRate) return "unknown";

  // Highly selective schools are always reach regardless of scores
  if (college.acceptanceRate < 0.1) return "reach";

  let reachSignals = 0;
  let safetySignals = 0;
  let totalSignals = 0;

  // GPA comparison
  if (college.avgGpa && student.gpa) {
    totalSignals++;
    const gpaDiff = student.gpa - college.avgGpa;
    if (gpaDiff < -0.3) reachSignals++;
    else if (gpaDiff > 0.3) safetySignals++;
  }

  // SAT comparison
  if (college.avgSat && student.sat) {
    totalSignals++;
    const satDiff = student.sat - college.avgSat;
    if (satDiff < -100) reachSignals++;
    else if (satDiff > 100) safetySignals++;
  }

  // ACT comparison (convert to SAT scale roughly)
  if (college.avgSat && student.act && !student.sat) {
    totalSignals++;
    const satEquiv = student.act * 22;
    const satDiff = satEquiv - college.avgSat;
    if (satDiff < -100) reachSignals++;
    else if (satDiff > 100) safetySignals++;
  }

  // Acceptance rate signals
  totalSignals++;
  if (college.acceptanceRate < 0.25) reachSignals++;
  else if (college.acceptanceRate > 0.6) safetySignals++;

  if (totalSignals === 0) return "unknown";
  const reachRatio = reachSignals / totalSignals;
  const safetyRatio = safetySignals / totalSignals;

  if (reachRatio >= 0.5) return "reach";
  if (safetyRatio >= 0.5) return "safety";
  return "target";
}

export function getCategoryColor(category: Category): string {
  switch (category) {
    case "reach":
      return "crimson";
    case "target":
      return "gold";
    case "safety":
      return "sage";
    default:
      return "navy/40";
  }
}

export function getCategoryLabel(category: Category): string {
  switch (category) {
    case "reach":
      return "Reach";
    case "target":
      return "Target";
    case "safety":
      return "Safety";
    default:
      return "Unrated";
  }
}
