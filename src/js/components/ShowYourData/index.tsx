import * as React from 'react';
import {WithTranslation, withTranslation} from 'react-i18next';

declare const firebase: typeof import('firebase');
import DataSnapshot = firebase.database.DataSnapshot;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const styles = require('./index.css');

type Props = {
    user: firebase.User;
} & WithTranslation

type State = {
    ref?: firebase.database.Reference;
    listener?: (snapshot: DataSnapshot) => void;
    data: any; // FIXME-any
}

class ShowYourData extends React.Component<Props, State> {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}`);
        const listener = (snapshot: DataSnapshot) => this.setState({ data: snapshot.val() || {} });
        this.setState({ ref, listener });
        ref.on('value', listener);
    }

    componentWillUnmount() {
        this.state?.ref?.off('value', this.state.listener);
    }

    private onSubmit(e: React.FormEvent<HTMLFormElement>) {
        if (!this.state?.ref) throw 'no ref';

        e.preventDefault();
        const { t } = this.props;
        const data = JSON.parse((e as any).target[0].value); // FIXME-any

        if (window.confirm(t('show_your_data.update_question'))) {
            this.state.ref.set(data).then(() => {
                window.alert(t('show_your_data.update_confirmation'));
            });
        }
    }

    render() {
        if (!this.state) return null;

        const { data } = this.state;
        if (!data) return null;

        const { t } = this.props;

        return (
            <div>
                <h1>{t('show_your_data.heading')}</h1>

                <p>{t('show_your_data.general_explanation')}</p>

                <p>
                    {t('show_your_data.delete_explanation', {
                        skipInterpolation: true,
                        postProcess: 'pp',
                        code: <span className={styles.code}>{'{}'}</span>,
                    })}
                </p>

                <form onSubmit={(e) => this.onSubmit(e)}>
                    <textarea
                        name="data"
                        cols={70}
                        rows={20}
                        defaultValue={JSON.stringify(data, null, 2)}
                    />

                    <p>
                        <input type="submit" value={"" + t('show_your_data.button')}/>
                    </p>
                </form>
            </div>
        )
    }
}

export default withTranslation()(ShowYourData);
