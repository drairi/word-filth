import * as React from 'react';

import QuestionForm from './question_form';

import { encode } from 'lib/results_key';
import * as stdq from '../../../shared/standard_form_question';
import {Question, VocabEntry} from "../../types";

type Args = {
    lang: string;
    engelsk: string;
    answers: Answer[];
    vocabSources: VocabEntry[];
}

type Answer = {
    køn: string;
    ubestemtEntal: string;
}

class GivenEnglishUbestemtEntalQuestion implements Question {

    public readonly lang: string;
    public readonly engelsk: string;
    public readonly answers: Answer[];
    public readonly resultsKey: string;
    public readonly vocabSources: VocabEntry[];

    constructor(args: Args) {
        this.lang = args.lang;
        this.engelsk = args.engelsk;
        this.answers = args.answers;
        this.vocabSources = args.vocabSources;

        this.resultsKey = `lang=${encode(this.lang || 'da')}`
            + `:type=SubstantivE2DUE`
            + `:engelsk=${encode(this.engelsk)}`;
    }

    get resultsLabel() {
        return this.engelsk;
    }

    get sortKey() {
        return this.engelsk;
    }

    get answersLabel() {
        // TODO i18n
        return this.answers
            .map(answer => `${answer.køn} ${answer.ubestemtEntal}`)
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
        if (!(other instanceof GivenEnglishUbestemtEntalQuestion)) return;

        return new GivenEnglishUbestemtEntalQuestion({
            lang: this.lang,
            engelsk: this.engelsk,
            answers: [...this.answers, ...other.answers], // FIXME dedup? sort?
            vocabSources: [...this.vocabSources, ...other.vocabSources],
        });
    }

}

export default GivenEnglishUbestemtEntalQuestion;
