export function toTitleCase(title: string): string {
    const words = title.split(' ')
    return words.map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

export function toSentenceCase(sentence: string): string {
    return sentence[0].toUpperCase() + sentence.slice(1);
}
