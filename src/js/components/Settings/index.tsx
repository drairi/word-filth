import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

declare const firebase: typeof import('firebase');

import LanguageInput from "../shared/language_input";
import DataSnapshot = firebase.database.DataSnapshot;

declare const BUILD_VERSION: string;
declare const BUILD_TIME: number;

interface Props extends WithTranslation {
    user: firebase.User;
}

interface State {
    ref?: firebase.database.Reference;
    listener?: any;
    languageListener: (value: string) => void;
    data: any;
}

class Settings extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        // FIXME: default settings
        const ref = firebase.database().ref(`users/${this.props.user.uid}/settings`);
        const listener = (snapshot: DataSnapshot) => this.setState({ data: snapshot.val() || {} });
        ref.on('value', listener);
        this.setState({ ref, listener });

        // FIXME: Why is this necessary?
        const me = this;
        let languageListener = (lang: string) => {
            console.log("language has changed to", lang);
            me.forceUpdate();
        };
        this.setState({ languageListener });
        this.props.i18n.on('languageChanged', languageListener);
    }

    componentWillUnmount() {
        this.state?.ref?.off('value', this.state.listener);
        const { languageListener } = this.state;
        if (languageListener) this.props.i18n.off('languageChanged', languageListener);
    }

    toggle(name: string) {
        const newRef = this.state.ref.child(name);
        newRef.set(!this.state.data[name]);
    }

    setUILanguage(lang: string) {
        this.props.i18n.changeLanguage(lang);
        this.state.ref.child('language').set(lang, (error: any) => {
            if (error) console.log("store language error", error);
        });
    }

    setVocabLanguage(lang: string) {
        this.state.ref.child('vocabLanguage').set(lang, (error: any) => {
            if (error) console.log("store language error", error);
        });
    }

    render() {
        if (!this.state) return null;
        const { data } = this.state;
        if (!data) return null;

        const { t, i18n } = this.props;

        return (
            <div>
                <h1>{t('settings.header')}</h1>

                <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!data.deactivateBuiltinVerbs}
                            onChange={() => this.toggle('deactivateBuiltinVerbs')}
                        />
                        {t('settings.disable_builtin_verbs.label')}
                    </label>
                </p>

                <p>
                    <label>
                        <input
                            type="checkbox"
                            checked={!!data.activateBabbel}
                            onChange={() => this.toggle('activateBabbel')}
                        />
                        {t('settings.enable_babbel.label')}
                    </label>
                </p>

                <h2>{t('settings.language.header')}</h2>

                <p>
                    {t('settings.ui_language.header')}
                    {' '}
                    <LanguageInput
                        key={new Date().toString()} // FIXME: Why is this needed?
                        autoFocus={false}
                        data-test-id={"ui-language"}
                        onChange={lang => this.setUILanguage(lang)}
                        allowedValues={['en', 'da', 'no']}
                        value={i18n.language}
                    />
                </p>

                <p>
                    {t('settings.vocabulary_language.header')}
                    {' '}
                    <LanguageInput
                        key={new Date().toString()} // FIXME: Why is this needed?
                        autoFocus={false}
                        data-test-id={"vocabulary-language"}
                        onChange={lang => this.setVocabLanguage(lang)}
                        allowedValues={['da', 'no']}
                        value={data.vocabLanguage || 'da'}
                    />
                </p>

                { /* TODO: i18n */ }
                <p className="buildVersion">
                    Built from {BUILD_VERSION}
                    {' '}at {new Date(BUILD_TIME).toString()}
                </p>
            </div>
        );
    }
}

export default withTranslation()(Settings);
