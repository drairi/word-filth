import React from "react";

import QuestionForm from '../shared/given_danish';

class GivenDanish {

    constructor(danishQuestion, englishAnswers) {
        this.danishQuestion = danishQuestion;
        this.englishAnswers = englishAnswers;

        this.resultsKey = "babbel-" + danishQuestion + "-GivenDanish";
        this.resultsLabel = danishQuestion;
    }

    createQuestionForm(props) {
        props = new Object(props);
        props.danishQuestion = this.danishQuestion;
        props.englishAnswers = this.englishAnswers;
        return React.createElement(QuestionForm, props, null);
    }

}

export default GivenDanish;
