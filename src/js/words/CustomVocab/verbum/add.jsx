import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Bøjning from "../../../shared/bøjning";
import TextTidier from '../../../shared/text_tidier';
import LanguageInput from "../../../components/shared/language_input";

class AddVerbum extends Component {
    constructor(props) {
        super(props);
        this.state = this.initialState(this.props.editingExistingKey, this.props.editingExistingData);
        this.props.onSearch(this.state.infinitiv);
        this.firstInputRef = React.createRef();
    }

    initialState(key, data) {
        const s = {
            editingExistingKey: key,
            vocabLanguage: (data && data.lang) || this.props.vocabLanguage,
            infinitiv: (data && data.infinitiv.replace(/^(at|å) /, '')) || '',
            bøjning: '',
            nutid: (data && data.nutid.join("; ")) || '',
            datid: (data && data.datid.join("; ")) || '',
            førnutid: (data && data.førnutid.join("; ")) || '',
            engelsk: (data && data.engelsk) || '',
        };

        s.itemToSave = this.itemToSave(s);

        return s;
    }

    itemToSave(state) {
        const tidyLowerCase = (s) => TextTidier.normaliseWhitespace(s.toLowerCase());
        const tidyMultiLowerCase = (s) => TextTidier.toMultiValue(s.toLowerCase());

        const infinitivePrefix = {
            da: 'at ',
            no: 'å ',
        }[state.vocabLanguage] || '';

        const item = {
            lang: state.vocabLanguage,
            type: 'verbum',
            infinitiv: infinitivePrefix + tidyLowerCase(state.infinitiv).replace(/^(at|å) /, ''),
            nutid: tidyMultiLowerCase(state.nutid),
            datid: tidyMultiLowerCase(state.datid),
            førnutid: tidyMultiLowerCase(state.førnutid),
        };

        if (!(item.infinitiv.match(/^(at|å) [a-zæøå]+$/))) return;
        if (!(item.nutid.every(t => t.match(/^[a-zæøå]+$/)))) return;
        if (!(item.datid.every(t => t.match(/^[a-zæøå]+$/)))) return;
        if (!(item.førnutid.every(t => t.match(/^[a-zæøå]+$/)))) return;

        // no toLowerCase
        let engelsk = TextTidier.normaliseWhitespace(state.engelsk);
        if (engelsk !== '') {
          if (!(engelsk.startsWith('to '))) engelsk = 'to ' + engelsk;
          item.engelsk = engelsk;
        }

        return item;
    }

    handleChange(newValue, field) {
        const newState = this.state;
        newState[field] = newValue;
        newState.itemToSave = this.itemToSave(newState);
        this.setState(newState);
        this.props.onSearch(newState.infinitiv);
    }

    handleBøjning(e) {
        const newState = this.state;

        const infinitiv = TextTidier.normaliseWhitespace(this.state.infinitiv)
          .toLowerCase().replace(/^(at|å) /, '');

        const bøjning = e.target.value.toLowerCase();
        newState.bøjning = bøjning;

        const result = new Bøjning().expandVerbum(infinitiv, bøjning.trim());
        if (result) {
          Object.keys(result).map(k => newState[k] = result[k]);
          newState.itemToSave = this.itemToSave(newState);
        }

        this.setState(newState);
    }

    onSubmit() {
        const { itemToSave } = this.state;
        if (!itemToSave) return;

        const newRef = (
            this.state.editingExistingKey
            ? this.props.dbref.child(this.state.editingExistingKey)
            : this.props.dbref.push()
        );

        newRef.set(itemToSave).then(() => {
            this.setState(this.initialState());
            this.props.onSearch();
            this.firstInputRef.current.focus();
        });
    }

    render() {
        const { t } = this.props;

        return (
            <form
                onSubmit={(e) => { e.preventDefault(); this.onSubmit(); }}
                onReset={this.props.onCancel}
            >
                <h2>{t('my_vocab.add_verb.heading')}</h2>

                <p>{t('my_vocab.add_verb.help_1')}</p>
                <p>{t('my_vocab.add_verb.help_2')}</p>
                <p>{t('my_vocab.add_verb.help_3')}</p>

                <table>
                    <tbody>
                        <tr>
                            <td>{t('my_vocab.shared.language.label')}</td>
                            <td>
                                <LanguageInput
                                    key={new Date().toString()} // FIXME: Why is this needed?
                                    autoFocus={false}
                                    data-test-id={"vocabulary-language"}
                                    onChange={lang => this.handleChange(lang, 'vocabLanguage')}
                                    allowedValues={['da', 'no']} // FIXME: share this
                                    value={this.state.vocabLanguage}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.infinitive.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.infinitiv}
                                    onChange={e => this.handleChange(e.target.value, 'infinitiv')}
                                    autoFocus="yes"
                                    ref={this.firstInputRef}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.inflection.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.bøjning}
                                    onChange={(e) => this.handleBøjning(e)}
                                />
                                {' '}
                                <i>{t('my_vocab.add_verb.inflection.example')}</i>
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.nutid.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.nutid}
                                    onChange={e => this.handleChange(e.target.value, 'nutid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.datid.label')}:</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.datid}
                                    onChange={e => this.handleChange(e.target.value, 'datid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('my_vocab.add_verb.førnutid.label')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.førnutid}
                                    onChange={e => this.handleChange(e.target.value, 'førnutid')}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>{t('question.shared.label.english')}</td>
                            <td>
                                <input
                                    type="text"
                                    size="30"
                                    value={this.state.engelsk}
                                    onChange={e => this.handleChange(e.target.value, 'engelsk')}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>
                    <input type="submit" value={
                        this.state.editingExistingKey
                        ? t('my_vocab.shared.update.button')
                        : t('my_vocab.shared.add.button')
                    } disabled={!this.state.itemToSave}/>
                    <input type="reset" value={t('my_vocab.shared.cancel.button')}/>
                </p>
            </form>
        )
    }
}

AddVerbum.propTypes = {
    t: PropTypes.func.isRequired,
    i18n: PropTypes.object.isRequired,
    dbref: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    vocabLanguage: PropTypes.string.isRequired,
    editingExistingKey: PropTypes.string,
    editingExistingData: PropTypes.object,
};

export default withTranslation()(AddVerbum);