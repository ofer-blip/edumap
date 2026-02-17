
import { GradeCategory } from './types';

export function getGradeCategory(gradesStr: string): GradeCategory {
  if (!gradesStr) return GradeCategory.OTHER;
  const cleanStr = gradesStr.replace(/['"״׳]/g, '').trim();

  if (cleanStr.includes('יסודי') && !cleanStr.includes('על')) return GradeCategory.ELEMENTARY;

  const includesAleph = cleanStr.includes('א');
  const includesYudBet = cleanStr.includes('יב');

  if (includesAleph && includesYudBet) return GradeCategory.MULTI;
  if (includesYudBet) return GradeCategory.HIGH;
  if (includesAleph) return GradeCategory.ELEMENTARY;

  return GradeCategory.OTHER;
}

export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: any;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}
