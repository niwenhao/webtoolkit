import React, { Component } from 'react'
import './json-formater.scss'

export class JSONFormater extends Component {
    state = {
        origin: "",
        formated: "",
        error: ""
    }

    formatJson(o) {
        let _formated = "";
        let _error = "";

        try {
            _formated = JSON.stringify(JSON.parse(o), null, "    ")
        } catch(e) {
            _error = e.toString();
        }

        this.setState({
            origin: o,
            formated: _formated,
            error: _error
        })
    }
    render() {
        return (
            <div className="JSONFormater">
                <table border="1" space="0" marge="0">
                    <tbody>
                        <tr>
                            <td>Origin</td>
                            <td><textarea value={this.state.origin} onChange={(e) => this.formatJson(e.target.value)}/></td>
                        </tr>
                        <tr>
                            <td>Formated</td>
                            <td><textarea value={this.state.formated}/></td>
                        </tr>
                        <tr>
                            <td>Error</td>
                            <td><textarea value={this.state.error}/></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default JSONFormater