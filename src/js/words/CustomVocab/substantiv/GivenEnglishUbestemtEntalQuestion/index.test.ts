import GivenEnglishUbestemtEntalQuestion from './index';

describe(GivenEnglishUbestemtEntalQuestion, () => {

    describe('constructor', () => {
        test('simple', () => {
            const q = new GivenEnglishUbestemtEntalQuestion({
                lang: 'da',
                engelsk: 'dog',
                answers: [{ køn: 'en', ubestemtEntal: 'hund' }],
                vocabSources: [],
            });

            expect(q.lang).toBe('da');
            expect(q.engelsk).toBe('dog');
            expect(q.answers).toStrictEqual([ { køn: 'en', ubestemtEntal: 'hund' } ]);

            expect(q.resultsKey).toBe('lang=da:type=SubstantivE2DUE:engelsk=dog');
            expect(q.resultsLabel).toBe('dog');
            expect(q.answersLabel).toBe('en hund');

        });
    });

    // TODO: multiple answers
    // TODO: merge

});
