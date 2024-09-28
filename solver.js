import readFile from "./words.js";

const allWords = await readFile('./wordlist.txt').then(a => a.split('\n'));

const letters = 'ENRSTAIULHOGCMKBDPFZWVYXJQ'.split('');

export default class Solver {
    constructor() {
        this.word = {};
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
        allWords.push(word);
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

        if (wordLetters.length < 1) {
            return letters.find(c => !this.guesses.includes(c));
        }

        const possibleWords = allWords.filter(
            word => wordLetters.every(c => word.split('').includes(c))
                && !wrongGuesses.some(c => word.split('').includes(c))
        );

        if (possibleWords.length === 0) {
            return letters.find(c => !this.guesses.includes(c));
        }

        const pattern = this.searchPattern();
        console.log('PATTERN:', pattern);

        const similarWords = possibleWords.filter(word => word.match(pattern) !== null);
        console.log('SIMILAR WORDS:', similarWords.length);

        if (similarWords.length === 0) {
            return this.bestLetterGuess(possibleWords);
        }

        return this.bestLetterGuess(similarWords);
    }

    bestLetterGuess(words) {
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
        let regex = '';

        let lastI;
        for (const i of Object.keys(this.word)) {
            if (!lastI) {
                regex = regex.concat(this.word[i]);
                lastI = i;
                continue;
            }

            const diff = Number(i) - Number(lastI);
            if (diff <= 1) {
                regex = regex.concat(this.word[i]);
                lastI = i;
                continue;
            }

            regex = regex.concat('.'.repeat(diff - 1), this.word[i]);
            lastI = i;
        }

        return new RegExp(regex);
    }
}