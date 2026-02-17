
import React from 'react';
import { SchoolType, GradeCategory } from './types';

export const COLORS: Record<SchoolType, string> = {
  [SchoolType.ANTHRO]: 'bg-orange-500',
  [SchoolType.DEMO]: 'bg-blue-500',
  [SchoolType.MONTESSORI]: 'bg-red-500',
  [SchoolType.MIXED]: 'bg-purple-500',
  [SchoolType.BILINGUAL]: 'bg-teal-500',
  [SchoolType.FOREST]: 'bg-green-500',
  [SchoolType.BIGPIC]: 'bg-yellow-600',
  [SchoolType.INCLUSIVE]: 'bg-pink-600',
};

export const TYPE_LABELS: Record<SchoolType, string> = {
  [SchoolType.ANTHRO]: 'אנתרופוסופי (ולדורף)',
  [SchoolType.DEMO]: 'דמוקרטי',
  [SchoolType.MONTESSORI]: 'מונטסורי',
  [SchoolType.MIXED]: 'משלב (דתי-חילוני)',
  [SchoolType.BILINGUAL]: 'דו-לשוני',
  [SchoolType.FOREST]: 'חינוך יער / טבע',
  [SchoolType.BIGPIC]: 'אדם ואדמה / Big Picture',
  [SchoolType.INCLUSIVE]: 'חינוך מכיל (אינקלו)',
};

export const TYPE_ICONS: Record<SchoolType, string> = {
  [SchoolType.ANTHRO]: 'fa-seedling',
  [SchoolType.DEMO]: 'fa-users',
  [SchoolType.MONTESSORI]: 'fa-shapes',
  [SchoolType.MIXED]: 'fa-handshake',
  [SchoolType.BILINGUAL]: 'fa-language',
  [SchoolType.FOREST]: 'fa-tree',
  [SchoolType.BIGPIC]: 'fa-lightbulb',
  [SchoolType.INCLUSIVE]: 'fa-puzzle-piece',
};

export const GRADE_FILTERS: Record<GradeCategory | 'all', string> = {
  all: 'כל הגילאים',
  [GradeCategory.ELEMENTARY]: "יסודי (א'-ו' / א'-ח')",
  [GradeCategory.HIGH]: "על-יסודי (ז'/ט'-י\"ב)",
  [GradeCategory.MULTI]: "רב-גילאי (א'-י\"ב)",
  [GradeCategory.OTHER]: 'אחר'
};
