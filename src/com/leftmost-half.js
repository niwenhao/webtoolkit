import { Map } from 'immutable';
import { connect } from 'react-redux';
import React, { Component } from 'react'
import sha256 from 'sha256';
import b64u from 'base64url'
import './leftmost-half.scss';


const render = (props) => {
    return (
        <div className="leftmost-half">
            <table>
                <tbody>
                    <tr>
                        <td>content</td>
                        <td><input type="text" value={props.content} onChange={ev => props.changed(ev.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>checksum</td>
                        <td><input type="text" value={props.checksum} /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

const ChangedAction = "leftmost-half-changed";
const StateKey = "leftmostHalf";

const initialize = () => Map({
    content: "",
    checksum: "",
});

const reducer = (state, action) => {
    if (state === undefined) return initialize();
    if (action.type === ChangedAction) {
        const buf = sha256(action.content, { asBytes: true }).slice(0, 16);
        return Map({
            content: action.content,
            checksum: b64u(buf)
        })
    } else {
        return state;
    }
};

const stateToProps = state => {
    return {
        content: state[StateKey].get('content'),
        checksum: state[StateKey].get('checksum')
    }
};

const dispatchToProps = dispatch => ({
    changed: value => dispatch({
        type: ChangedAction,
        content: value
    })
})


export default {
    stateKey: StateKey,
    reducer: reducer,
    initialize: initialize
};
export const LeftmostHalf = connect(stateToProps, dispatchToProps, void 0, { pure: true })(render);