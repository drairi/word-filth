import * as React from 'react';

import QuestionForm from './question_form';
import {Question, VocabEntry} from '../../types';
import * as stdq from '../../../shared/standard_form_question';
import { encode } from "lib/results_key";
import {unique} from "lib/unique-by";

export type Args = {
    lang: string;
    english: string;
    danishAnswers: string[];
    vocabSources: VocabEntry[];
}

class AdjektivGivenEnglish implements Question {

    public readonly lang: string;
    public readonly english: string;
    public readonly danishAnswers: string[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.english = args.english;
        this.danishAnswers = args.danishAnswers;
        this.vocabSources = args.vocabSources;

        this.resultsKey = `lang=${encode(args.lang || 'da')}`
            + `:type=AdjektivGivenEnglish`
            + `:engelsk=${encode(args.english)}`;
    }

    get resultsLabel() {
        return this.english;
    }

    get sortKey() {
        return this.english;
    }

    get answersLabel() {
        return unique(this.danishAnswers).sort().join(" / ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            lang: this.lang,
            question: this.english,
            allowableAnswers: this.danishAnswers,
            vocabSources: this.vocabSources,
        }, null);
    }

    merge(other: Question): Question | undefined {
        if (!(other instanceof AdjektivGivenEnglish)) return;

        return new AdjektivGivenEnglish({
            lang: this.lang,
            english: this.english,
            danishAnswers: [...this.danishAnswers, ...other.danishAnswers],
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default AdjektivGivenEnglish;
