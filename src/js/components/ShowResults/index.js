import React, { Component } from "react";
import PropTypes from "prop-types";

import ShowResultsRow from "./row";

class ShowResults extends Component {
    componentDidMount() {
        const ref = firebase.database().ref(`users/${this.props.user.uid}/results`);
        ref.on('value', snapshot => this.setState({ results: snapshot.val() }));
        this.setState({ ref: ref });
    }

    componentWillUnmount() {
        if (this.state.ref) this.state.ref.off();
    }

    render() {
        if (!this.state) return null;
        const { results } = this.state;
        if (!results) return null;

        // Object.keys(results).map(k => {
        //     if (k.startsWith("verb-at-")) {
        //         this.state.ref.child(k).remove();
        //     }
        // });

        return (
            <div id="VerbList" className={'message'}>
                <h2>Resultater</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nøgle</th>
                            <th>Niveau</th>
                            <th>Prøv igen efter</th>
                            {/*<th>Historie</th>*/}
                        </tr>
                    </thead>
                    <tbody>
                    {Object.keys(results).sort().map(key => (
                        <ShowResultsRow
                            resultKey={key}
                            resultValue={results[key]}
                            key={key}
                        />
                    ))}

                    </tbody>
                </table>
            </div>
        )
    }
}

ShowResults.propTypes = {
    user: PropTypes.object.isRequired
}

export default ShowResults;
