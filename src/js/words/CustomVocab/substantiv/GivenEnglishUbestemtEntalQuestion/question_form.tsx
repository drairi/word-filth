import * as React from 'react';
import { withTranslation } from 'react-i18next';

import GenderInput from "@components/shared/gender_input";
import * as stdq from "../../../shared/standard_form_question";
import {unique} from "lib/unique-by";
import GivenEnglishUbestemtEntalQuestion from "./index";
import ShowVocabSources from "../../../shared/show_vocab_sources";

export type Props = {
    question: GivenEnglishUbestemtEntalQuestion;
} & stdq.Props

export type State = {
    kønValue: string | null;
    ubestemtEntalValue: string;
} & stdq.State<Attempt>

export type Attempt = {
    køn: string;
    ubestemtEntal: string;
}

class QuestionForm extends stdq.QuestionForm<Props, State, Attempt> {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.defaultState(),
            kønValue: '',
            ubestemtEntalValue: '',
        };
    }

    handleKøn(value: string | null) {
        this.setState({ kønValue: value });
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>, field: "ubestemtEntalValue") {
        const newState = {...this.state};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    getGivenAnswer() {
        const køn = this.state.kønValue;
        const ubestemtEntal = this.state.ubestemtEntalValue.trim().toLowerCase();

        if (!køn || ubestemtEntal === '') {
            return undefined;
        }

        return { køn, ubestemtEntal };
    }

    checkAnswer({ køn, ubestemtEntal }: Attempt) {
        const { question } = this.props;

        return question.answers.some(answer => (
            køn === answer.køn
            && ubestemtEntal.toLowerCase() === answer.ubestemtEntal.toLowerCase()
        ));
    }

    allGivenAnswers(givenAnswers: Attempt[]): React.ReactFragment {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        return givenAnswers
            .map(answer => `${answer.køn} ${answer.ubestemtEntal}`)
            .map(sv => <>{sv}</>)
            .reduce((prev, curr) => <span>{prev}<br key="br"/>{'så: '}{curr}</span>);
    }

    allAllowableAnswers(): React.ReactFragment {
        // TODO: t complex
        const t: string[] = this.props.question.answers
            .map(answer => `${answer.køn} ${answer.ubestemtEntal}`)
            .sort();

        const x = unique(t)
            .map((sv: string, index: number) => <b key={index}>{sv}</b>)
            .reduce((prev, curr) => <>{prev}{' eller '}{curr}</>);

        return <span>{x}</span>;
    }

    renderShowCorrectAnswer(givenAnswers: Attempt[]) {
        const { t } = this.props;

        return (
            <div>
                <p>
                    {t('question.shared.wrong.you_answered')}{' '}
                    {this.allGivenAnswers(givenAnswers)}
                </p>
                <p>
                    {t('question.shared.wrong.but_it_was')}{' '}
                    {this.allAllowableAnswers()}
                </p>
                <ShowVocabSources vocabSources={this.props.question.vocabSources}/>
            </div>
        );
    }

    renderPraise() {
        const { t } = this.props;

        return (
            <div>
                <p>{t('question.shared.correct')}</p>
                <p>{this.allAllowableAnswers()}</p>
                <ShowVocabSources vocabSources={this.props.question.vocabSources}/>
            </div>
        );
    }

    renderQuestionForm() {
        const { t, question } = this.props;

        const engelskArtikel = (
            question.engelsk.match(/^[aeiou]/)
                ? 'an'
                : 'a'
        );

        return (
            <div>
                <p>
                    {t('question.shared.how_do_you_say_in_danish', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        english: <b>{engelskArtikel} {question.engelsk}</b>,
                    })}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{t('question.shared.label.danish')}</td>
                        <td>
                            <span style={{margin: 'auto 0.5em'}}>
                                <GenderInput
                                    value={this.state.kønValue}
                                    onChange={v => this.handleKøn(v)}
                                    autoFocus={true}
                                    data-testid="køn"
                                />
                            </span>
                            <input
                                type="text"
                                size={30}
                                value={this.state.ubestemtEntalValue}
                                onChange={(e) => this.handleChange(e, 'ubestemtEntalValue')}
                                data-testid="ubestemtEntal"
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withTranslation()(QuestionForm);
