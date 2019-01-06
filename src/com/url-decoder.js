import React, { Component } from 'react'

import { connect } from 'react-redux'
import { Map } from 'immutable'

import './url-decoder.scss'

const initialize = () => Map({
    encodedQuery: "",
    urlPath: "",
    parameters: [],
    error: ""
});

const StateKey = "url-decoder-state";

const URLChanged = "url-decoder-url-changed";

const mapStateToProps = (state) => state[StateKey].toJS();
const mapDispatchToProps = (dispatch) => ({
    urlChanged: (url) => dispatch({
        type: URLChanged,
        url: url
    })
})

const reducer = (state, action) => {
    if (!state) state = initialize();

    if (action.type === URLChanged) {
        return Map(decodeURL(action.url))
    } else return state;
}

function decodeURL(query) {
    const q = query;
    let u = "";
    let ps = "";
    let psl = [];
    let err = "";

    const parts = q.split(/[\?#]/)
    if (parts.length == 2) {
        u = parts[0];
        ps = parts[1];
    } else {
        u = "";
        ps = q;
    }

    try {
        psl = ps.split(/&/).map((pa, i) => {
            let kv = pa.split(/=/);
            let k;
            let v;
            if (kv.length == 2) {
                k = decodeURIComponent(kv[0]).replace(/\+/g, " ")
                v = decodeURIComponent(kv[1]).replace(/\+/g, " ")
            } else {
                k = ""
                v = decodeURI(pa);
            }

            return {
                index: i,
                name: k,
                value: v
            }
        })


    } catch (e) {
        err = e.toString();
    }
    return {
        encodedQuery: q,
        urlPath: u,
        parameters: psl,
        error: err
    };
}

const render = (props) => (
            <div className="urlDecoder">
                <table border="1" space="0" marge="0">
                    <tbody>
                        <tr>
                            <td>URL</td>
                            <td colSpan={2}><textarea value={props.encodedQuery} onChange={(e) => props.urlChanged(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Path</td>
                            <td colSpan={2}><input type="text" style={{ width: "600px" }} value={props.urlPath} /></td>
                        </tr>
                        <tr>
                            <td rowSpan={1 + props.parameters.length}>パラメータ</td>
                            <td className="title">Name</td>
                            <td>Value</td>
                        </tr>
                        {
                            props.parameters.map(p =>
                                <tr key={p.index}>
                                    <td className="title">{p.name}</td>
                                    <td><input type="text" value={p.value} /></td>
                                </tr>
                            )
                        }
                        <tr>
                            <td>Error</td>
                            <td colSpan={2}><textarea value={props.error} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )

export default {
    stateKey: StateKey,
    reducer: reducer,
    initialize: initialize
};
export const URLDecoder = connect(mapStateToProps, mapDispatchToProps, void 0, { pure: true })(render);
