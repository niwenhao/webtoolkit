import React, { Component } from 'react'
import sha256 from 'sha256';
import jose from 'node-jose';
import b64u from 'base64url';

import './jose-encode.scss'

class JOSEDecode extends Component {
    state = {
        payload: "",
        //signKey: "68c21043-d216-465b-8e75-aea043f1f5be",
        signKey: "6b1fb908-8a36-4a7c-9805-7ebd4010a7ac",
        signedJWT: "",
        encryptKey: "6b1fb908-8a36-4a7c-9805-7ebd4010a7ac",
        encryptedJWT: "",
        error: ""
    }

    updateOriginJWT(jwt) {
        this.updateData(jwt, this.state.signKey, this.state.encryptKey)
    }

    updateSignKey(key) {
        this.updateData(this.state.signedJWT, key, this.state.encryptKey)

    }

    updateEncryptKey(key) {
        this.updateData(this.state.signedJWT, this.state.signKey, key)
    }

    updateData(origJwt, signKey, encKey) {
        let ret = {
            encryptedJWT: origJwt,
            signKey: signKey,
            encryptKey: encKey
        };

        const updateError = err => {
            ret.error = err.toString() + err.stack;
            this.setState(ret)
        }

        updateError.bind(this)

        try {
            let rst;
            if (encKey.length >= 32) {
                let key = encKey.length === 32 ? Buffer.from(encKey) : Buffer.from(sha256(encKey, { asBytes: true }));

                rst = new Promise((resolve, reject) => {
                    jose.JWK.asKey({
                        kty: 'oct',
                        k: b64u(key),
                        alg: 'dir',
                        enc: 'A128CBC-HS256'
                    }).then(ekey => {
                        jose.JWE.createDecrypt(ekey)
                            .decrypt(ret.encryptedJWT)
                            .then(resolve, reject)
                    }, reject)
                })
            } else {
                rst = new Promise(r => r(ret.encryptedJWT))
            }

            rst = rst.then(jwt => {
                console.log(jwt.plaintext.toString())
                ret.signedJWT = jwt.plaintext.toString();
                let signRst;
                if (signKey.length >= 32) {
                    let key = Buffer.from(signKey);
                    signRst = new Promise((resolve, reject) => {
                        jose.JWK.asKey({
                            kty: 'oct',
                            k: b64u(key),
                            alg: 'HS256'
                        }).then((skey) => {
                            jose.JWS.createVerify(skey)
                                .verify(jwt.plaintext.toString())
                                .then(resolve, reject)
                        }, reject)
                    })
                } else {
                    signRst = new Promise(r => r(jwt))
                }
                return signRst;
            });

            rst.then(jwt => {
                ret.payload = jwt.payload.toString();
                this.setState(ret);
            }, updateError);
        } catch (err) {
            updateError(err);
        }
    }

    render() {
        return (
            <div className="jose-encode">
                <div className="error">{this.state.error}</div>
                <table border="1">
                    <tbody>
                        <tr>
                            <td>Origin JWT</td>
                            <td><textarea value={this.state.encryptedJWT} onChange={(e) => this.updateOriginJWT(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Encrypt Key</td>
                            <td><input type="text" value={this.state.encryptKey} onChange={(e) => this.updateEncryptKey(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Signed JWT</td>
                            <td><textarea value={this.state.signedJWT} /></td>
                        </tr>
                        <tr>
                            <td>Sign Key</td>
                            <td><input type="text" value={this.state.signKey} onChange={(e) => this.updateSignKey(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td>Payload</td>
                            <td><textarea value={this.state.payload} /></td>
                        </tr>
                    </tbody>
                </table>

            </div>
        )
    }
}

export default JOSEDecode;