import { Section } from '@/types/tracker';
import { addDays, format } from 'date-fns';

/**
 * Recalculate start and end dates for each main topic section
 * based on its exact document complexity weight (originalWeightDays).
 */
export function recalculateTrackTimeline(
  sections: Section[],
  startDateStr: string,
  totalDays: number
): Section[] {
  if (sections.length === 0) return sections;

  let baseDate: Date;
  try {
    baseDate = startDateStr ? new Date(startDateStr) : new Date();
    if (isNaN(baseDate.getTime())) baseDate = new Date();
  } catch {
    baseDate = new Date();
  }

  // Sum of original document weights (default to 90 days if not set)
  const totalOriginalWeight = sections.reduce(
    (acc, sec) => acc + (sec.originalWeightDays || 1),
    0
  );

  let currentDayOffset = 0;

  return sections.map((sec) => {
    const weight = sec.originalWeightDays || 1;
    // Calculate proportional days based on complexity weight
    const rawAllocated = (weight / totalOriginalWeight) * totalDays;
    const allocatedDays = Math.max(1, Math.round(rawAllocated));

    const secStartDate = addDays(baseDate, currentDayOffset);
    const secEndDate = addDays(secStartDate, Math.max(0, allocatedDays - 1));

    currentDayOffset += allocatedDays;

    return {
      ...sec,
      startDate: format(secStartDate, 'dd MMM'),
      endDate: format(secEndDate, 'dd MMM'),
    };
  });
}
