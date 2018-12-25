import React, { Component } from 'react'

import './url-decoder.scss'

export class URLDecoder extends Component {
    state = {
        encodedQuery: "",
        urlPath: "",
        parameters: [],
        error: ""
    }

    decodeURL(query) {
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
        this.setState({
            encodedQuery: q,
            urlPath: u,
            parameters: psl,
            error: err
        })
    }
    render() {
        return (
            <div className="urlDecoder">
                <table border="1" space="0" marge="0">
                    <tbody>
                        <tr>
                            <td>URL</td>
                            <td colSpan={2}><textarea value={this.state.encodedQuery} onChange={(e) => this.decodeURL(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Path</td>
                            <td colSpan={2}><input type="text" style={{width: "600px"}} value={this.state.urlPath}/></td>
                        </tr>
                        <tr>
                            <td rowSpan={1 + this.state.parameters.length}>パラメータ</td>
                            <td className="title">Name</td>
                            <td>Value</td>
                        </tr>
                        {
                            this.state.parameters.map(p =>
                                <tr key={p.index}>
                                    <td className="title">{p.name}</td>
                                    <td><input type="text" value={p.value}/></td>
                                </tr>
                            )
                        }
                        <tr>
                            <td>Error</td>
                            <td colSpan={2}><textarea value={this.state.error}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default URLDecoder