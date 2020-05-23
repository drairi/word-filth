import * as React from 'react';

// import arrayUniq from 'array-uniq';
import TextTidier from '../../shared/text_tidier';
import * as stdq from './standard_form_question';

const arrayUniq = (input: string[]) => {
    // FIXME
    return input;
};

export interface Props extends stdq.StdQProps{
    lang: string;
    question: string;
    allowableAnswers: string[];
}

export interface State extends stdq.StdQState<Attempt> {
    answerValue: string;
}

export interface Attempt {
    givenAnswer: string;
}

abstract class GivenOneLanguageAnswerTheOther extends stdq.StandardFormQuestion<Props, State, Attempt> {
    constructor(props: Props) {
        super(props);

        this.state = {
            ...(this.state || {}),
            ...this.defaultState(),
            answerValue: '',
        };
    }

    handleChange(event: any, field: string) {
        const newState: any = {};
        newState[field] = event.target.value;
        this.setState(newState);
    }

    getGivenAnswer() {
        const givenAnswer = TextTidier.normaliseWhitespace(this.state.answerValue);

        if (givenAnswer === '') {
            return;
        }

        return { givenAnswer };
    }

    checkAnswer(attempt: Attempt) {
        return this.props.allowableAnswers.some(allowableAnswer =>
            TextTidier.normaliseWhitespace(allowableAnswer).toLowerCase() ===
            TextTidier.normaliseWhitespace(attempt.givenAnswer).toLowerCase()
        );
    }

    allGivenAnswers(givenAnswers: Attempt[]): React.ReactFragment {
        if (givenAnswers.length === 0) return '-';

        // TODO: t complex
        const t = givenAnswers
            .map((sv, index) => <>{sv}</>)
            .reduce((prev, curr) => <>{prev}<br key="br"/>{'så: '}{curr}</>);

        return t;
    }

    allAllowableAnswers(): React.ReactFragment {
        if (this.props.allowableAnswers.length === 0) return '-';

        // TODO: t complex
        const t = arrayUniq(this.props.allowableAnswers.sort())
            .map((sv: string) => <b>{sv}</b>)
            .reduce((prev: React.ReactFragment, curr: React.ReactFragment) => <>{prev}{' eller '}{curr}</>);

        return t;
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
            </div>
        );
    }

    renderPraise() {
        const { t } = this.props;

        return (
            <div>
                <p>{t('question.shared.correct')}</p>
                <p>{this.allAllowableAnswers()}</p>
            </div>
        );
    }

    abstract questionPhrase(q: string): React.ReactFragment;
    abstract answerLabel(): string;

    renderQuestionForm() {
        return (
            <div>
                <p>
                    {this.questionPhrase(this.props.question)}
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>{this.answerLabel()}</td>
                        <td><input
                            value={this.state.answerValue}
                            size={30}
                            autoFocus={true}
                            onChange={(e) => this.handleChange(e, 'answerValue')}
                        /></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}


// TODO: why no "withTranslation()(...)" here?
export default GivenOneLanguageAnswerTheOther;