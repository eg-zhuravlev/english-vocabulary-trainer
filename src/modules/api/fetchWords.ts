const WORDS = [
    "apple",
    "function",
    "timeout",
    "task",
    "application",
    "data",
    "tragedy",
    "sun",
    "symbol",
    "button",
    "software"
];
const WORDS_COUNT = 6;

export const fetchWords = () => {
    return Promise.resolve([...WORDS].sort(() => 0.5 - Math.random()).slice(0, WORDS_COUNT));
};
