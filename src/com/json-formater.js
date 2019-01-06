import React, { Component } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import './json-formater.scss';

const initialize = state => Map({
    origin: "",
    formated: "",
    error: ""
})

const formatJson = (o) => {
    let _formated = "";
    let _error = "";

    try {
        _formated = JSON.stringify(JSON.parse(o), null, "    ")
    } catch (e) {
        _error = e.toString();
    }

    return Map({
        origin: o,
        formated: _formated,
        error: _error
    })
}

const render = props => (
    <div className="JSONFormater">
        <table border="1" space="0" marge="0">
            <tbody>
                <tr>
                    <td>Origin</td>
                    <td><textarea value={props.origin} onChange={(e) => props.jsonChanged(e.target.value)} /></td>
                </tr>
                <tr>
                    <td>Formated</td>
                    <td><textarea value={props.formated} /></td>
                </tr>
                <tr>
                    <td>Error</td>
                    <td><textarea value={props.error} /></td>
                </tr>
            </tbody>
        </table>
    </div>
)

const StateKey = "json-formater-state";
const JsonChanged = "json-formater-json-changed";

const mapStateToProps = state => state[StateKey].toJS();

const mapDispatchToProps = dispatch => (
    {
        jsonChanged: function (json) {
            dispatch({
                type: JsonChanged,
                json: json
            })
        }
    }
)

const reducer = (state, action) => {

    let nextstate = state ? state : initialize();

    if (action.type === JsonChanged) {
        return formatJson(action.json);
    } else return nextstate;
}

export default {
    stateKey: StateKey,
    reducer: reducer,
    initialize: initialize
};
export const JSONFormater = connect(mapStateToProps, mapDispatchToProps, void 0, { pure: true })(render);
