import Adjektiv from "./adjektiv";
import Default from './default';
import Substantiv from './substantiv';
import Udtryk from './udtryk';
import Verbum from "./verbum";

class CustomVocab {

    constructor(db) {
        this.vocab = db.vocab || {};
    }

    getAll() {
        const handlers = {
            adjektiv: Adjektiv,
            udtryk: Udtryk,
            substantiv: Substantiv,
            verbum: Verbum,
        };

        return Object.keys(this.vocab)
            .map(vocabKey => {
                const data = this.vocab[vocabKey];
                const handler = handlers[data.type] || Default;
                return new handler(vocabKey, data);
            });
    }

    getAllQuestions() {
        let q = [];
        const items = this.getAll();

        q = q.concat(
            Adjektiv.getQuestions(
                items.filter(item => item.data.type === 'adjektiv')
            )
        );

        q = q.concat(
            Verbum.getQuestions(
                items.filter(item => item.data.type === 'verbum')
            )
        );

        q = q.concat(
            Substantiv.getQuestions(
                items.filter(item => item.data.type === 'substantiv')
            )
        );

        q = q.concat(
            Udtryk.getQuestions(
                items.filter(item => item.data.type === 'udtryk')
            )
        );

        return q;
    }

}

export default CustomVocab;
