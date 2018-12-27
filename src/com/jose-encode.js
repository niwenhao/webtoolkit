import React, { Component } from 'react'

import sha256 from 'sha256';
import json from 'node-jose';
import b64u from 'base64url';
import { ReadStream } from 'fs';

export class JOSEEncode extends Component {
    state = {
        payload: "",
        signKey: "",
        signedJWT: "",
        encryptKey: "",
        encryptedJWT: "",
        error: ""
    }

    updatePayload(payload) {
        this.updateData(payload, this.state.signKey, this.state.encryptKey)
    }

    updateSignKey(key) {
        this.updateData(this.state.payload, key, this.state.encryptKey)

    }

    updateEncryptKey(key) {
        this.updateData(this.state.payload, this.state.signKey, key)
    }

    updateData(payload, signKey, encKey) {
        let ret = {
            payload: payload,
            signKey: signKey,
            encryptKey: encKey
        };

        try {
            let signRst;
            if (signKey.length >= 32) {
                let key = signKey.length === 32 ? Buffer.from(signKey) : Buffer.from(sha256(signKey, { asBytes: true }));
                signRst = new Promise((resolve, reject) => {
                    json.JWK.asKey({
                        kty: 'oct',
                        k: b64u(key)
                    }).then((skey) => {
                        jose.JWS.createSign({ format: "compact" },
                            { key: skey, header: { alg: "HS256" } })
                            .update(ret.payload)
                            .final()
                            .then(resolve)
                            .catch(reject)
                    }).catch(reject)
                })
            } else {
                signRst = new Promise(r => r(payload))
            }
            signRst.then(jwt => )
        } catch (e) {
            ret.error = e.toString();
        }

        this.setState(ret);
    }
    render() {
        return (
            <div>
                <div className="error">{this.state.error}</div>
                <table border="1">
                    <tbody>
                        <tr>
                            <td>Payload</td>
                            <td><textarea value={this.state.payload} onChange={(e) => this.updatePayload(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Sign Key</td>
                            <td><textarea value={this.state.signKey} onChange={(e) => this.updateSignKey(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Signed JWT</td>
                            <td><textarea value={this.state.signedJWT} /></td>
                        </tr>
                        <tr>
                            <td>Encrypt Key</td>
                            <td><textarea value={this.state.encryptKey} onChange={(e) => this.updateEncryptKey(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Encrypted JWT</td>
                            <td><textarea value={this.state.encryptedJWT} /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default JOSEEncode
