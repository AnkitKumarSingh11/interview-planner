import { Section } from '@/types/tracker';
import { addDays, format, parseISO } from 'date-fns';

export function recalculateTrackTimeline(
  sections: Section[],
  startDateStr: string, // YYYY-MM-DD
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

  // Weight each section based on question count (or equal weight if 0)
  const totalQuestions = sections.reduce(
    (acc, sec) => acc + sec.subsections.reduce((sAcc, sub) => sAcc + sub.questions.length, 0),
    0
  );

  let currentDayOffset = 0;

  return sections.map((sec, index) => {
    const qCount = sec.subsections.reduce((acc, sub) => acc + sub.questions.length, 0);
    const weight = totalQuestions > 0 ? qCount / totalQuestions : 1 / sections.length;
    
    // Allocate days to section
    const allocatedDays = Math.max(1, Math.round(weight * totalDays));

    const secStartDate = addDays(baseDate, currentDayOffset);
    // End date is secStartDate + allocatedDays - 1 (or at least 1 day)
    const secEndDate = addDays(secStartDate, Math.max(0, allocatedDays - 1));

    currentDayOffset += allocatedDays;

    return {
      ...sec,
      startDate: format(secStartDate, 'dd MMM'),
      endDate: format(secEndDate, 'dd MMM'),
    };
  });
}
