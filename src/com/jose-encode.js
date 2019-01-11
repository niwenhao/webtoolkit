import React, { Component } from 'react'

import { Map } from 'immutable';

import sha256 from 'sha256';
import jose from 'node-jose';
import b64u from 'base64url';
import './jose-encode.scss'

export class JOSEEncode extends Component {
    state = {
        payload: "",
        signKey: "6b1fb908-8a36-4a7c-9805-7ebd4010a7ac",
        signedJWT: "",
        encryptKey: "6b1fb908-8a36-4a7c-9805-7ebd4010a7ac",
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

        const updateError = err => {
            ret.error = err;
            this.setState(ret)
        }

        updateError.bind(this)

        let signRst;
        if (signKey.length >= 32) {
            let key = Buffer.from(signKey);
            signRst = new Promise((resolve, reject) => {
                jose.JWK.asKey({
                    kty: 'oct',
                    k: b64u(key)
                }).then((skey) => {
                    jose.JWS.createSign({ format: "compact" },
                        { key: skey, header: { alg: "HS256" } })
                        .update(ret.payload)
                        .final()
                        .then(resolve)
                        .catch(reject)
                }, reject)
            })
        } else {
            signRst = new Promise(r => r(payload))
        }
        signRst.then(jwt => {
            console.log("jwt = " + jwt)
            ret.signedJWT = jwt;
            let encRst;
            if (encKey.length >= 32) {
                let key = encKey.length === 32 ? Buffer.from(encKey) : Buffer.from(sha256(encKey, { asBytes: true }));

                encRst = new Promise((resolve, reject) => {
                    jose.JWK.asKey({
                        kty: 'oct',
                        k: b64u(key)
                    }).then(ekey => {
                        jose.JWE.createEncrypt({
                            format: 'compact',
                        }, {
                                header: {
                                    alg: 'dir',
                                    enc: 'A128CBC-HS256'
                                },
                                key: ekey
                            })
                            .update(jwt)
                            .final().then(resolve).catch(reject)
                    }, reject)
                })

            } else {
                encRst = new Promise(r => r(jwt))
            }
            encRst.then(jwt => {
                ret.encryptedJWT = jwt;
                this.setState(ret);
            }, updateError)

        }, updateError)
    }

    render() {
        return (
            <div className={"jose-encode"}>
                <div className="error">{this.state.error}</div>
                <table border="1">
                    <tbody>
                        <tr>
                            <td>Payload</td>
                            <td><textarea value={this.state.payload} onChange={(e) => this.updatePayload(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Sign Key</td>
                            <td><input type="text" value={this.state.signKey} onChange={(e) => this.updateSignKey(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Signed JWT</td>
                            <td><textarea value={this.state.signedJWT} /></td>
                        </tr>
                        <tr>
                            <td>Encrypt Key</td>
                            <td><input type="text" value={this.state.encryptKey} onChange={(e) => this.updateEncryptKey(e.target.value)} /></td>
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
