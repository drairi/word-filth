import * as React from 'react';

import QuestionForm from './question_form';

import { encode } from 'lib/results_key';
import * as stdq from '../../../shared/standard_form_question';
import {Question, VocabEntry} from "../../types";
import SubstantivVocabEntry from "../substantiv_vocab_entry";
import {unique} from "lib/unique-by";

type Args = {
    lang: string;
    ubestemtEntal: string;
    answers: SubstantivVocabEntry[];
    vocabSources: VocabEntry[];
}

export default class GivenUbestemtEntalQuestion implements Question {

    public readonly lang: string;
    public readonly ubestemtEntal: string;
    public readonly answers: SubstantivVocabEntry[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.ubestemtEntal = args.ubestemtEntal;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

        this.resultsKey = `lang=${encode(this.lang)}`
            + `:type=SubstantivDUE2All`
            + `:q=${encode(this.ubestemtEntal)}`;
    }

    get resultsLabel() {
        return this.ubestemtEntal;
    }

    get sortKey() {
        return this.ubestemtEntal;
    }

    get answersLabel() {
        // TODO i18n
        return unique(
            this.answers
                .map(answer => [
                    answer.køn,
                    answer.bestemtEntal,
                    answer.ubestemtFlertal,
                    answer.bestemtFlertal,
                ].filter(s => s).join(", "))
            )
            .sort()
            .join(" / ");
    }

    createQuestionForm(props: stdq.Props) {
        return React.createElement(QuestionForm, {
            ...props,
            question: this,
        }, null);
    }

    merge(other: Question): Question | undefined {
        if (!(other instanceof GivenUbestemtEntalQuestion)) return;

        return new GivenUbestemtEntalQuestion({
            lang: this.lang,
            ubestemtEntal: this.ubestemtEntal,
            answers: [...this.answers, ...other.answers], // FIXME dedup? sort?
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

