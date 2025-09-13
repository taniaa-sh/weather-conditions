export const isEnglish = (value: string): boolean => {
  return /^[a-zA-Z0-9_-]*$/.test(value);
};