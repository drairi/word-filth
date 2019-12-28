import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

class QuestionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            engelsk: '',

            attempts: [],

            fadingMessage: null,
            showPraise: false,
            showCorrectAnswer: false,
        };
    }

    handleChange(event, field) {
        const newState = {};
        newState[field] = event.target.value.toLowerCase();
        this.setState(newState);
    }

    onAnswer() {
        const engelsk = this.state.engelsk.trim().toLowerCase();

        if (engelsk === '') {
            this.showFadingMessage("Svaret skal udfyldes");
            return;
        }

        const isCorrect = this.checkAnswer(engelsk);
        this.props.onResult(isCorrect);

        if (isCorrect) {
            this.setState({ showPraise: true });
        } else {
            const attempts = this.state.attempts.concat(engelsk);
            this.setState({ attempts });
            this.showFadingMessage('Næ, det er det ikke');
        }
    }

    checkAnswer(engelsk) {
        return(this.props.allowableAnswers.some(allowable => engelsk.toLowerCase() === allowable.toLowerCase()));
    }

    onGiveUp() {
        this.props.onResult(false);
        this.setState({ showCorrectAnswer: true });
    }

    showFadingMessage(message, timeout) {
        this.setState({ fadingMessage: message });
        const t = this;
        window.setTimeout(() => {
            t.setState((prevState, props) => {
                if (prevState.fadingMessage === message) {
                    return({ fadingMessage: null });
                } else {
                    return {};
                }
            });
        }, timeout || 2500);
    }

    allAttempts() {
        return this.state.attempts
            .map(sv => <span key={sv}>{sv}</span>)
            .reduce((prev, curr) => [prev, <br/>, 'så: ', curr]);
    }

    allAnswers() {
        if (this.props.allowableAnswers.length === 0) return '-';

        return this.props.allowableAnswers.sort()
            .map(sv => <b key={sv}>{sv}</b>)
            .reduce((prev, curr) => [prev, ' eller ', curr]);
    }

    render() {
        const { substantiv } = this.props;

        if (this.state.showCorrectAnswer) {
            return (
                <div>
                    <p>
                        Du svarede: {this.allAttempts()}/>
                    </p>
                    <p>
                        Det var faktisk: {this.allAnswers()}/>
                    </p>
                    <p>
                        <input
                            type="button"
                            value="Fortsæt"
                            onClick={this.props.onDone}
                            autoFocus="yes"
                        />
                    </p>
                </div>
            );
        }

        if (this.state.showPraise) {
            return (
                <div>
                    <p>Lige præcis!</p>
                    <p>{this.allAnswers()}</p>
                    <p>
                        <input
                            type="button"
                            value="Fortsæt"
                            onClick={this.props.onDone}
                            autoFocus="yes"
                        />
                    </p>
                </div>
            );
        }

        const { fadingMessage } = this.state;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onAnswer(); }}
                onReset={(e) => { e.preventDefault(); this.onGiveUp(); }}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
            >
                <p>
                    Hvordan siger man på engelsk, <span>
                    {substantiv.ubestemtEntal ? (
                        <span>({substantiv.køn}) <b>{substantiv.ubestemtEntal}</b></span>
                    ) : (
                            <b>{substantiv.ubestemtFlertal}</b>
                    )}</span>
                    ?
                </p>

                <table>
                    <tbody>
                    <tr>
                        <td>Engelsk:</td>
                        <td>
                            <input
                                type="text"
                                size="30"
                                value={this.state.engelsk}
                                onChange={(e) => this.handleChange(e, 'engelsk')}
                                autoFocus="yes"
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value="Svar"/>
                    <input type="reset" value="Giv op"/>
                </p>

                {fadingMessage && (
                    <p key={fadingMessage}>{fadingMessage}</p>
                )}
            </form>
        );
    }
}

QuestionForm.propTypes = {
    substantiv: PropTypes.object.isRequired,
    allowableAnswers: PropTypes.array.isRequired,
    onResult: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired
};

export default QuestionForm;
