    //helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

const User = require('../models/User')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = class UserController {
    static async register(req, res) {
        const {name, email, phone, password, confirmpassword} = req.body

        //validation
        if(!name) {
            res.status(422).json({message: "O nome é obrigatório!"})
            return
        }

        if(!email) {
            res.status(422).json({message: "O email é obrigatório!"})
            return
        }

        if(!phone) {
            res.status(422).json({message: "O telefone é obrigatório!"})
            return
        }

        if(!password) {
            res.status(422).json({message: "A senha é obrigatório!"})
            return
        }

        if(!confirmpassword) {
            res.status(422).json({message: "A confirmação de senha é obrigatório!"})
            return
        }

        if(password !== confirmpassword) {
            res.status(422).json({message: "A senha e sua confirmação precisam ser iguais!"})
            return
        }

        //checar se o usuário existe
        const userExists = await User.findOne({ email: email })

        if(userExists) {
        res.status(422).json({message: 'Não há usuário cadastrado com esse email!'})
        return
        }

        //criação de senha
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

         //criação de usuário
        const user = new User ({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, req, res)
        } catch(error){
            res.status(500).json({ message: error })
        }
    }

    static async login(req, res) {

        const {email, password} = req.body

        if(!email) {
            res.status(422).json({message: "O e-mail é obrigatório!"})
            return
        }

        if(!password) {
            res.status(422).json({message: "A senha é obrigatória!"})
            return
        }

        //checar se o usuário existe
        const user = await User.findOne({ email: email })

        if(!user) {
            res.status(422).json({message: 'Não há usuário cadastrado com esse email!'})
            return
        }

        // checar se a senha coincide com a senha do banco de dados
        const checkPassword = await bcrypt.compare( password, user.password )
        if(!checkPassword) {
            res.status(422).json({message: "Senha inválida!"})
            return
        }
        await createUserToken(user, req, res)
    }

    static async checkUser(req, res) {

        let currentUser

        if(req.headers.authorization) {

            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        } else {
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req, res) {

        const id = req.params.id
        
        const user = await User.findById(id).select('-password')

        if(!user) {
            res.status(422).json({message: 'Usuário não encontrado!'})
            return
        }

        res.status(200).json({ user })

    }

    static async editUser(req, res) {
    
        const id = req.params.id

        //checar se o usuário existe
        const token = getToken(req)
        const user = await getUserByToken(token)
        
        const {name,  email, phone, password, confirmpassword} = req.body

        if(req.file) {
            user.image = req.file.filename
        }

        //validações
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }

        user.name = name

        if(!email) {
            res.status(422).json({message: 'O e-mail é obrigatório!'})
            return
        }

        // //checar se o e-mail já está sendo utilizado
        // const userExists = await User.findOne({email: email})

        // if(!user.email !== email  && userExists) {
        //     res.status(422).json({message: 'Por favor, utilize outro e-mail!'})
        //     return
        // }

        user.email = email

        if(!phone) {
            res.status(422).json({message: 'O número de telefone é obrigatório!'})
            return
        }

        user.phone = phone  

        if(password !== confirmpassword) {
            res.status(422).json({message: 'As senhas precisam se coincidir!'})
            return
        } else if ( password === confirmpassword && password != null ) {

            //criação de senha
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash

        }

        try {
            //retonar o upload dos dados do usuário
            await User.findOneAndUpdate(
                {_id:user._id},
                {$set: user},
                {new: true},
            )
            res.status(200).json({ message: 'Usuário atualizado com sucesso!'})

        } catch (err) {
            res.status(500).json({message: err})
            return
        }
    }
}


