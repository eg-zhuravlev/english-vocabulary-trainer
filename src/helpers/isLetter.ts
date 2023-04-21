const reg = /[a-zA-Z]/i;

export const isLetter = (str: string) => {
  return str.length === 1 && str.match(reg);
};
