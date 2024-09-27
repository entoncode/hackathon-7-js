import wordlist from "./words.js";

const letters = ['E', 'N', 'I', 'S', 'R', 'A', 'T', 'D', 'H', 'U', 'L', 'C', 'G', 'M', 'O', 'B', 'W', 'F', 'K', 'Z', 'P', 'V', 'J', 'Y', 'X', 'Q'];

const basePattern = '^[A-Z]*%[A-Z]*$';
const nLetters = (amount) => `[A-Z]{0,${amount}}`;

export default class Solver {
    constructor() {
        this.word = {};
        this.guessables = [];
        this.guesses = [];
    }

    save(word) {
        this.word = this.serializeWord(word);
    }

    next() {
        const move = this.nextMove();
        this.guesses.push(move);
        return move;
    }

    addWord(word) {
        wordlist.push(word);
    }

    serializeWord(word) {
        const serialized = {};
        for (let i = 0; i < word.length; i++) {
            if (word[i] === '_') {
                continue;
            }

            serialized[i] = word[i];
        }
        return serialized;
    }

    nextMove() {
        const wordLetters = Object.values(this.word);
        const wrongGuesses = this.guesses.filter(x => !wordLetters.includes(x));

        if (wordLetters.length < 3) {
            return letters[this.guesses.length];
        }

        const possibleWords = wordlist.filter(
            word => wordLetters.every(c => word.split('').includes(c))
                && !wrongGuesses.some(c => word.split('').includes(c))
        );

        if (possibleWords.length === 0) {
            return letters.find(c => !this.guesses.includes(c));
            //
        }

        const pattern = this.searchPattern();
        // console.log('PATTERN:', pattern);

        this.guessables = possibleWords.filter(word => word.match(pattern) !== null);
        console.log('SIMILAR WORDS:', this.guessables.length);

        if (this.guessables.length === 0) {
            return this.firstGuessableLetter(possibleWords);
        }

        return this.firstGuessableLetter(this.guessables);
    }

    firstGuessableLetter(words) {
        let move;
        for (const word of words) {
            move = letters.find(c => word.split('').includes(c) && !this.guesses.includes(c));
            if (move !== undefined) {
                return move;
            }
        }

        return letters.find(c => !this.guesses.includes(c));
    }

    searchPattern() {
        let replacement = '';

        let lastI;
        for (const i of Object.keys(this.word)) {
            if (!lastI) {
                replacement = replacement.concat(this.word[i]);
                lastI = i;
                continue;
            }

            const diff = Number(i) - Number(lastI);
            if (diff <= 1) {
                replacement = replacement.concat(this.word[i]);
                lastI = i;
                continue;
            }

            replacement = replacement.concat(nLetters(diff - 1), this.word[i]);
            lastI = i;
        }

        return new RegExp(basePattern.replace('%', replacement));
    }
}