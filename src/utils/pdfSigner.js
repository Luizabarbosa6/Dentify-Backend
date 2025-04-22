const fs = require('fs')
const crypto = require('crypto')
require('dotenv').config()

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8')
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8')

function assinarLaudo(texto) {
    const sign = crypto.createSign('SHA256')
    sign.update(texto)
    sign.end()
    const assinatura = sign.sign(privateKey, 'base64')
    return assinatura
}

function verificarAssinatura(texto, assinatura) {
    const verify = crypto.createVerify('SHA256')
    verify.update(texto)
    verify.end()
    return verify.verify(publicKey, assinatura, 'base64')
}

module.exports = { assinarLaudo, verificarAssinatura }