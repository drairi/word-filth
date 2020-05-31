import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

import AddAdjective from "../../words/CustomVocab/adjektiv/add";
import AddPhrase from '../../words/CustomVocab/udtryk/add';
import AddNoun from '../../words/CustomVocab/substantiv/add';
import AddVerb from '../../words/CustomVocab/verbum/add';

import CustomVocab from '../../words/CustomVocab';
import ShowList from './show_list';

declare const firebase: typeof import('firebase');

interface Props extends WithTranslation {
    user: firebase.User;
}

interface State {
    ref: firebase.database.Reference;
    vocab: any;
    vocabLanguage: string;
    isAdding: any;
    editingExistingKey: string;
    editingExistingData: string;
    isDeleting: boolean;
    selectedKeys: Set<string>;
    searchText: string;
}

class MyVocabPage extends React.Component<Props, State> {


    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/vocab`);
        ref.on('value', snapshot => this.setState({ vocab: snapshot.val() || [] }));
        this.setState({ ref });

        // FIXME: default settings
        firebase.database().ref(`users/${this.props.user.uid}/settings/vocabLanguage`)
            .once('value', snapshot => this.setState({ vocabLanguage: snapshot.val() || 'da' }));
    }

    componentWillUnmount() {
        this.state?.ref?.off();
    }

    startAdd(type: any) {
        this.setState({
            isAdding: type,
            editingExistingKey: null,
            editingExistingData: null,
            isDeleting: false
        });
    }

    startDelete() {
        this.setState({
            isAdding: null,
            isDeleting: true,
            selectedKeys: new Set(),
        });
    }

    cancelAdd() {
        this.setState({ isAdding: null, searchText: null });
    }

    onAddSearch(text: string) {
        this.setState({ searchText: text });
    }

    cancelDelete() {
        this.setState({ isDeleting: false });
    }

    toggleSelected(vocabKey: string) {
        if (this.state.selectedKeys.has(vocabKey)) {
            this.state.selectedKeys.delete(vocabKey);
        } else {
            this.state.selectedKeys.add(vocabKey);
        }
        this.setState({ selectedKeys: this.state.selectedKeys });
    }

    doDelete() {
        const { t } = this.props;

        const count = this.state.selectedKeys.size;

        const message = (
            (count === 1)
            ? t('my_vocab.delete.confirmation.1', { count })
            : t('my_vocab.delete.confirmation.>1', { count })
        );

        if (window.confirm(message)) {
            // TODO: also delete any question-results for this item
            const promises = Array.from(this.state.selectedKeys).map(vocabKey => this.state.ref.child(vocabKey).remove());
            Promise.all(promises).then(() => {
                this.setState({ isDeleting: false });
            });
        }
    }

    startEdit(vocabKey: string) {
        if (this.state.isAdding || this.state.isDeleting) return;

        const vocabData = this.state.vocab[vocabKey];
        if (!vocabData) return;

        const type = ({
          substantiv: AddNoun,
          verbum: AddVerb,
          adjektiv: AddAdjective,
          udtryk: AddPhrase,
        } as any)[vocabData.type];

        if (!type) return;

        this.setState({
            isAdding: type,
            editingExistingKey: vocabKey,
            editingExistingData: vocabData,
            isDeleting: false,
        });
    }

    render() {
        if (!this.state) return null;

        const { vocab, vocabLanguage, isAdding, isDeleting } = this.state;
        if (!vocab) return null;
        if (!vocabLanguage) return null;

        const vocabList = new CustomVocab({ vocab }).getAll();

        const selectedKeys = isDeleting ? this.state.selectedKeys : new Set<string>();
        const anySelected = selectedKeys.size > 0;

        const { t } = this.props;

        return (
            <div>
                <h1>{t('my_vocab.header')}</h1>

                {!isAdding && !isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.startAdd(AddNoun)} value={"" + t('my_vocab.add_noun.button')}/>
                        <input type="button" onClick={() => this.startAdd(AddVerb)} value={"" + t('my_vocab.add_verb.button')}/>
                        <input type="button" onClick={() => this.startAdd(AddAdjective)} value={"" + t('my_vocab.add_adjective.button')}/>
                        <input type="button" onClick={() => this.startAdd(AddPhrase)} value={"" + t('my_vocab.add_phrase.button')}/>
                        <input type="button" onClick={() => this.startDelete()} value={"" + t('my_vocab.delete.button')}/>
                    </p>
                )}
                {isAdding && (
                    <div style={{paddingBottom: '1em', borderBottom: '1px solid black', marginBottom: '1em'}}>
                        {React.createElement(isAdding, {
                            dbref: this.state.ref,
                            onCancel: () => this.cancelAdd(),
                            onSearch: this.onAddSearch.bind(this),
                            vocabLanguage,
                            editingExistingKey: this.state.editingExistingKey,
                            editingExistingData: this.state.editingExistingData,
                        }, null)}
                    </div>
                )}
                {isDeleting && (
                    <p>
                        <input type="button" onClick={() => this.doDelete()} disabled={!anySelected} value={"" + t('my_vocab.delete.action.button')}/>
                        <input type="button" onClick={() => this.cancelDelete()} value={"" + t('my_vocab.shared.cancel.button')}/>
                    </p>
                )}

                <ShowList
                    vocabList={vocabList}
                    isDeleting={!!isDeleting}
                    selectedKeys={selectedKeys}
                    onToggleSelected={key => this.toggleSelected(key)}
                    onEdit={key => this.startEdit(key)}
                    searchText={this.state.searchText}
                />
            </div>
        )
    }
}

export default withTranslation()(MyVocabPage);