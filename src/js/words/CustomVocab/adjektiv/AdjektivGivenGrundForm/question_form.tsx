import * as React from 'react';
import { withTranslation } from 'react-i18next';

import * as stdq from "../../../shared/standard_form_question";

import Question from "./index";
import {unique} from "lib/unique-by";
import ShowVocabSources from "../../../shared/show_vocab_sources";
import {bøj} from "lib/bøjning";

export type Props = {
    question: Question;
} & stdq.Props

export type State = {
    tFormValue: string;
    langFormValue: string;
    komparativValue: string;
    superlativValue: string;
} & stdq.State<Attempt>

export type Attempt = {
    tForm: string;
    langForm: string;
    komparativ: string | null;
    superlativ: string | null;
};

class QuestionForm extends stdq.QuestionForm<Props, State, Attempt> {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...this.defaultState(),
            tFormValue: '',
            langFormValue: '',
            komparativValue: '',
            superlativValue: '',
        };
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>, field: "tFormValue" | "langFormValue" | "komparativValue" | "superlativValue") {
        const newState = {...this.state};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    onBlur(field: "tFormValue" | "langFormValue" | "komparativValue" | "superlativValue") {
        this.setState((prevState: State) => {
            const expanded = bøj(this.props.question.grundForm, prevState[field]);
            const newState = {...prevState};
            newState[field] = expanded;
            return newState;
        });
    }

    getGivenAnswer() {
        this.onBlur('tFormValue');
        this.onBlur('langFormValue');
        this.onBlur('komparativValue');
        this.onBlur('superlativValue');

        const tForm = this.state.tFormValue.trim().toLowerCase();
        const langForm = this.state.langFormValue.trim().toLowerCase();
        const komparativ = this.state.komparativValue.trim().toLowerCase() || null;
        const superlativ = this.state.superlativValue.trim().toLowerCase() || null;

        if (tForm === '' || langForm === '' || (!!komparativ !== !!superlativ)) {
            return undefined;
        }

        return { tForm, langForm, komparativ, superlativ };
    }

    checkAnswer(attempt: Attempt) {
        const { question } = this.props;

        return question.answers.some(answer => (
            attempt.tForm === answer.tForm
            && attempt.langForm === answer.langForm
            && attempt.komparativ === answer.komparativ
            && attempt.superlativ === answer.superlativ
        ));
    }

    formatAnswer(answer: Attempt) {
        return [
            this.props.question.grundForm,
            answer.tForm,
            answer.langForm,
            answer.komparativ,
            answer.superlativ,
        ].filter(v => v).join(', ');
    }

    allGivenAnswers(givenAnswers: Attempt[]): React.ReactFragment {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        return givenAnswers
            .map(answer => this.formatAnswer(answer))
            .map((sv, index) => <span key={index}>{sv}</span>)
            .reduce((prev, curr) => <span>{prev}<br key="br"/>{'så: '}{curr}</span>);
    }

    allAllowableAnswers(): React.ReactFragment {
        // TODO: t complex
        const t = unique(
                (this.props.question.answers as Attempt[])
                    .map(answer => this.formatAnswer(answer))
                    .sort()
            )
            .map((sv, index: number) => <span key={index}>
                <b>{sv}</b>
                {this.props.question.engelsk && <>
                  <span style={{marginLeft: '0.3em'}}>({this.props.question.engelsk})</span>
                </>}
            </span>)
            .reduce((prev, curr) => <>{prev}{' eller '}{curr}</>);

        return <span>{t}</span>;
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
        const { question } = this.props;

        // TODO: i18n

        return (
            <div>
                <p>
                    How do you form the adjective{' '}
                    <b key="grundForm">{question.grundForm}</b>
                    {question.engelsk && (<span> ({question.engelsk})</span>)}
                    ?
                </p>

                <table>
                    <tbody>
                        <tr>
                            <td>grund form:</td>
                            <td>{question.grundForm}</td>
                        </tr>
                        <tr>
                            <td>t-form:</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.tFormValue}
                                    onChange={(e) => this.handleChange(e, 'tFormValue')}
                                    onBlur={() => this.onBlur('tFormValue')}
                                    data-testid="tForm"
                                    autoFocus={true}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>lang form:</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.langFormValue}
                                    onChange={(e) => this.handleChange(e, 'langFormValue')}
                                    onBlur={() => this.onBlur('langFormValue')}
                                    data-testid="langForm"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>komparativ:</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.komparativValue}
                                    onChange={(e) => this.handleChange(e, 'komparativValue')}
                                    onBlur={() => this.onBlur('komparativValue')}
                                    data-testid="komparativ"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>superlativ:</td>
                            <td>
                                <input
                                    type="text"
                                    size={30}
                                    value={this.state.superlativValue}
                                    onChange={(e) => this.handleChange(e, 'superlativValue')}
                                    onBlur={() => this.onBlur('superlativValue')}
                                    data-testid="superlativ"
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
