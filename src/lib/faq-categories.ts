export const FAQ_CATEGORY_VALUES = ["for_parents", "for_tutors"] as const;

export type FaqCategory = (typeof FAQ_CATEGORY_VALUES)[number];

export const DEFAULT_FAQ_CATEGORY: FaqCategory = "for_parents";
export const FAQ_CATEGORY_QUERY_PARAM = "category";

export const FAQ_CATEGORY_OPTIONS: Array<{
  value: FaqCategory;
  label: string;
}> = [
  { value: "for_parents", label: "For Parents" },
  { value: "for_tutors", label: "For Tutors" },
];

export const isFaqCategory = (value: string | null): value is FaqCategory =>
  FAQ_CATEGORY_VALUES.includes(value as FaqCategory);
