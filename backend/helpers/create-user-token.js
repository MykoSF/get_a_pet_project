const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {

    // criação de token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "nossosecret")

    // retorno do token
    res.status(200).json({
        message: "Você está autenticado!",
        token: token,
        userId: user._id,
    })


}

module.exports = createUserToken