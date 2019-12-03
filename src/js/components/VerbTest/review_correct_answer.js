import React, { Component } from "react";
import PropTypes from "prop-types";

class ReviewCorrectAnswer extends Component {
    render() {
        const { infinitive, verbs } = this.props;

        const answers = verbs.map(verb => {
            return verb.nutid.map(t => `<b>${t}</b>`).join(' eller ')
            + ', ' + verb.datid.map(t => `<b>${t}</b>`).join(' eller ')
            + ', ' + verb.førnutid.map(t => `<b>${t}</b>`).join(' eller ');
        }).sort();

        const allAnswers = answers.sort().join('; eller ');

        const ddoLink = `https://ordnet.dk/ddo/ordbog?query=${escape(infinitive.replace(/^at /, ''))}`;

        return (
            <div>
                <p>
                    Det var faktisk: <span dangerouslySetInnerHTML={{__html: allAnswers}}/>
                </p>
                <p>
                    <a href={ddoLink}>Leæs mere på DDO</a>
                </p>
                <button
                    autoFocus={'yes'}
                    onClick={this.props.onClose}
                >Fortsæt</button>
            </div>
        )
    }
}

ReviewCorrectAnswer.propTypes = {
    infinitive: PropTypes.string.isRequired,
    verbs: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ReviewCorrectAnswer;
