function checkSpam(str) {
  const lowerStr = str.toLowerCase();
    const spamWords = ['1xbet', 'xxx'];

    for (const word of spamWords) {
        if (lowerStr.includes(word)) {
            return true;
        }
    }

    return false;
}
