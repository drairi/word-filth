import React from "react";
import i18n from "../../../../i18n-setup";
import {mount} from "enzyme/build";

import AddAdjektiv from './add';

describe(AddAdjektiv, () => {

    const dbWrites = [];
    let nextChild;

    const dbref = {
        push: () => {
            nextChild = nextChild + 1;
            return { key: "child" + nextChild };
        },
        child: (key) => ({
            set: (data) => {
                dbWrites.push({ key: key, data: data });
                return Promise.resolve();
            },
            remove: () => {
                dbWrites.push({ key: key });
                return Promise.resolve();
            },
        }),
    };

    const onCancel = jest.fn();
    const onSearch = jest.fn();
    let wrapper;

    beforeEach(() => {
        nextChild = 0;
        dbWrites.splice(0);

        const form = React.createElement(
            AddAdjektiv,
            {
                t: i18n.t,
                i18n: i18n,
                dbref: dbref,
                onCancel: onCancel,
                onSearch: onSearch,
                vocabLanguage: 'no',
            },
            null
        );

        wrapper = mount(form);
    });

    afterEach(() => {
        onCancel.mockReset();
        onSearch.mockReset();
    });

    const fillIn = (field, value) => {
        wrapper.find('input[data-testid="' + field + '"]').simulate('change', { target: { value: value }});
    };

    const valueOf = (field) => {
        return wrapper.find('input[data-testid="' + field + '"]').prop('value');
    };

    const saveEnabled = () => {
        return !wrapper.find('input[type="submit"]').prop('disabled');
    };

    test('renders in initial state', () => {
        expect(wrapper.text()).toContain('Enter the base, t- and long forms');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('only grund form', () => {
        fillIn('grundForm', 'rød');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + t-form', () => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + t-form + langForm', () => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        fillIn('langForm', 'røde');
        expect(saveEnabled()).toBe(true);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + t-form + langForm + engelsk', () => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        fillIn('langForm', 'røde');
        fillIn('engelsk', 'red');
        expect(saveEnabled()).toBe(true);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + bøjning', () => {
        fillIn('grundForm', 'rød');
        fillIn('bøjning', '-t, -e');
        expect(valueOf('tForm')).toBe('rødt');
        expect(valueOf('langForm')).toBe('røde');
        expect(saveEnabled()).toBe(true);
        expect(onCancel).not.toHaveBeenCalled();
    });

    const submitAndExpectSave = (done, expectedItem) => {
        wrapper.find('form').simulate('submit');

        // FIXME: interval hack
        setTimeout(() => {
            expect(dbWrites).toStrictEqual([ { key: "child1", data: expectedItem } ]);

            wrapper.update();
            expect(valueOf('grundForm')).toBe('');
            expect(valueOf('bøjning')).toBe('');
            expect(valueOf('tForm')).toBe('');
            expect(valueOf('langForm')).toBe('');
            expect(valueOf('superlativ')).toBe('');
            expect(valueOf('komparativ')).toBe('');
            expect(valueOf('engelsk')).toBe('');

            expect(onCancel).not.toHaveBeenCalled();

            done();
        }, 10);
    };

    test('grund form + t-form + langForm + engelsk', (done) => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        fillIn('langForm', 'røde');
        fillIn('engelsk', 'red');

        submitAndExpectSave(done, {
            lang: 'no',
            type: 'adjektiv',
            grundForm: 'rød',
            tForm: 'rødt',
            langForm: 'røde',
            komparativ: null,
            superlativ: null,
            engelsk: 'red',
            tags: null,
        });
    });

    test('grund form + t-form + langForm + komparativ + engelsk', () => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        fillIn('langForm', 'røde');
        fillIn('komparativ', 'rødere');
        fillIn('engelsk', 'red');
        expect(saveEnabled()).toBe(false);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + t-form + langForm + komparativ + superlativ + engelsk', () => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        fillIn('langForm', 'røde');
        fillIn('komparativ', 'rødere');
        fillIn('superlativ', 'rødest');
        fillIn('engelsk', 'red');
        expect(saveEnabled()).toBe(true);
        expect(onCancel).not.toHaveBeenCalled();
    });

    test('grund form + t-form + langForm + komparativ + superlativ + engelsk', done => {
        fillIn('grundForm', 'rød');
        fillIn('tForm', 'rødt');
        fillIn('langForm', 'røde');
        fillIn('komparativ', 'rødere');
        fillIn('superlativ', 'rødest');
        fillIn('engelsk', 'red');

        submitAndExpectSave(done, {
            lang: 'no',
            type: 'adjektiv',
            grundForm: 'rød',
            tForm: 'rødt',
            langForm: 'røde',
            komparativ: 'rødere',
            superlativ: 'rødest',
            engelsk: 'red',
            tags: null,
        });
    });

    test('only grund form then cancel', () => {
        fillIn('grundForm', 'rød');
        wrapper.find('form').simulate('reset');
        expect(onCancel).toHaveBeenCalled();
    });

});
