const { Schema, model} = require('mongoose');

const usuarioSchema = Schema({
    nombre : {
        type : String,
        required : [true, 'El nombre es obligatorio']
    },
    correo : {
        type : String,
        required : [true, 'El correo es requerido'],
        unique : true
    },
    password : {
        type : String,
        required : [true, 'La contraseña es obligatoria']
    },
    img : {
        type : String,
    },
    role : {
        type : String,
        required : true,
        enum : ['ADMIN_ROLE','USER_ROLE']
    },
    estado : {
        type : Boolean,
        default : true
    },
    google : {
        type : Boolean,
        default : false
    }
});

usuarioSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();

    return user;
}

module.exports = model( 'Usuario' , usuarioSchema);