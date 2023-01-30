const { timeStamp } = require("console");
const Router = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");

const sqlite3 = require('sqlite-sync');

const router = Router();


const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/utilDocs'),
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})


//Middleware
const multerUpload = multer({
    storage: storage,
    dest: path.join(__dirname, '../public/utilDocs'),
    fileFilter: (req,file,cb) => {
        const fileTypes = /csv|jpg/;
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname))
        if(mimetype && extName){
            return cb(null, true);
        }
        cb("Error: el archivo debe ser una imagen valida")
    }
}).single("foto");


router.use(Router.urlencoded());

// Ruta raiz del servidor
router.get('/', (req, res) => {
    console.log("Conexion Raiz Servidor");
    res.send(devolverFecha())
  })


  
// Registro de nuevo usuario
  router.post("/altasUsuarioZPPencriptacion", async (req,res) =>{
    console.log("Alta de Usuario");
    console.log(req.params);
    console.log(req.body);
    console.log('Query');
    console.log(req.query);
    // Open a database connection
    sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
        if (err) {
            console.log('Error Conexión DB');
            return console.error(err.message);
        }
        console.log('[Usuarios.getLogin] Connected to the SQlite file database.');
    });
    let sql = "select * from USUARIOS where C_USUARIO='" + req.query.UserEMail +"';";
    ret = sqlite3.run(sql);
    console.log(ret[0]);
    if(ret[0] == undefined){
        try{
            let userSalt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.query.UserPasswd, 10);
            // const hashedPassword = await bcrypt.hash(req.query.UserPasswd, userSalt);
            
            let usuario = {
                docIdentUsuario : req.query.UserDocIdent, 
                denomUsuario : req.query.UserDenom, 
                EMailUsuario : req.query.UserEMail, 
                telefUsuario : req.query.UserTel, 
                tipoViaUsuario : req.query.UserTipoVia, 
                nomViaUsuario : req.query.UserNomVia, 
                numUsuario : req.query.UserNumVia, 
                pisoUsuario : req.query.UserPiso, 
                letraUsuario : req.query.UserLetra, 
                infoAdicUsuario : req.query.UserInfoAdic, 
                codPostalUsuario : req.query.UserCodPostal, 
                // docIdentUsuario : req.params.UserDocIdent, 
                // denomUsuario : req.params.UserDenom, 
                // EMailUsuario : req.params.UserEMail, 
                // telefUsuario : req.params.UserTel, 
                // tipoViaUsuario : req.queparamsry.UserTipoVia, 
                // nomViaUsuario : req.params.UserNomVia, 
                // numUsuario : req.params.UserNumVia, 
                // pisoUsuario : req.params.UserPiso, 
                // letraUsuario : req.params.UserLetra, 
                // infoAdicUsuario : req.params.UserInfoAdic, 
                // codPostalUsuario : req.params.UserCodPostal, 
                passwordUsuario : hashedPassword,
                salt : userSalt
            }
            if(await bcrypt.compare(req.query.UserPasswd, hashedPassword)){
                console.log("Las contraseñas son iguales");
            }
            else{
                console.log('no son iguales');
            }
            
            
            // Open a database connection
            sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
                if (err) {
                    console.log('Error Conexión DB');
                    return console.error(err.message);
                }
                console.log('[Usuarios.postUsuarios] Connected to the SQlite file database.');
            });
            
            let sql = "INSERT INTO USUARIOS (C_USUARIO, DNI_CIF, DENOMINACION, CORREO_E, TLF, TIPO_VIA, NOMBRE_VIA, NUM_VIA, PISO, LETRA, INFORM_ADIC, COD_POSTAL, PASSWORD, SALT) VALUES ('" + usuario.EMailUsuario + "', '"+ usuario.docIdentUsuario +"', '" + usuario.denomUsuario + "', '" + usuario.EMailUsuario + "', " + usuario.telefUsuario + ", '" + usuario.tipoViaUsuario + "', '" + usuario.nomViaUsuario + "', " + usuario.numUsuario + ", " + usuario.pisoUsuario + ", '" + usuario.letraUsuario + "', '" + usuario.infoAdicUsuario + "', '" + usuario.codPostalUsuario + "', '" + usuario.passwordUsuario + "', '" + usuario.salt + "')";
            console.log(sql);
            ret = sqlite3.run(sql);
            console.log(ret);
            let sql2 = "select * from USUARIOS";
            ret = sqlite3.run(sql2);
            sqlite3.close();
            
            res.send({estado: "OK"});
            // res.status(201).send;
        }
        catch{
            res.status(500).send();
        }
    }
    else{
        // res.send("USUARIO YA EXISTENTE");
        res.status(501).send();
    }
    
    
    // res.send("Uploaded Photo");
    
});




// Modificación Datos Usuario
router.put("/modifDatosUsuario", async (req,res) =>{
    console.log("Modif de Usuario");
    console.log('Query');
    console.log(req.query);
    let usuario = {
        docIdentUsuario : req.query.UserDocIdent, 
        denomUsuario : req.query.UserDenom, 
        EMailUsuario : req.query.UserEMail, 
        telefUsuario : req.query.UserTel, 
        tipoViaUsuario : req.query.UserTipoVia, 
        nomViaUsuario : req.query.UserNomVia, 
        numUsuario : req.query.UserNumVia, 
        pisoUsuario : req.query.UserPiso, 
        letraUsuario : req.query.UserLetra, 
        infoAdicUsuario : req.query.UserInfoAdic, 
        codPostalUsuario : req.query.UserCodPostal, 
    }    
    // Open a database connection
    sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
        if (err) {
            console.log('Error Conexión DB');
            return console.error(err.message);
        }
        console.log('[Usuarios.postUsuarios] Connected to the SQlite file database.');
    });
    let sql = "UPDATE USUARIOS set DNI_CIF = '" + usuario.docIdentUsuario + "', DENOMINACION = '" + usuario.denomUsuario + "', TLF = '" + usuario.telefUsuario + "', TIPO_VIA = '" + usuario.tipoViaUsuario + "', NOMBRE_VIA = '" + usuario.nomViaUsuario + "', NUM_VIA = '" + usuario.numUsuario + "', PISO = '" + usuario.pisoUsuario + "', LETRA = '" + usuario.letraUsuario + "', INFORM_ADIC = '" + usuario.infoAdicUsuario + "', COD_POSTAL = '" + usuario.codPostalUsuario + "' where C_USUARIO = '" + usuario.EMailUsuario + "';";
    console.log(sql);
    ret = sqlite3.run(sql);
    console.log(ret);
    sqlite3.close();
    
    res.send({estado: "OK"});
            // res.status(201).send;
    // res.send("Uploaded Photo");
    
});




// Validación de inicio de sesión 
router.post('/loginZPP', async(req, res) => {
    console.log("loginZPP");
    console.log(req.query);
    // Open a database connection
    sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
        if (err) {
            console.log('Error Conexión DB');
            return console.error(err.message);
        }
    });
    let sql = "select * from USUARIOS where C_USUARIO='" + req.query.UserEMail +"';";
    ret = sqlite3.run(sql);
    if(ret[0] == undefined){
        res.status(502).send();//Usuario no encontrado
    }
    else{
        sqlite3.close();
        if(await bcrypt.compare(req.query.UserPasswd, ret[0].PASSWORD)){
            let respu = ret[0];
            if(ret[0].NECESARIO_CAMBIO_PASSWD == "S"){
                res.send({respuesta: "Cambio passwd necesario", respu});
            }else{
                res.send({respuesta: "Acceso Concedido" , respu});
            }
        }
        else{
            // res.send("ACCESO DENEGADO");
            res.status(503).send();
        }
    }
    
})

router.post('/resetPasswdZPP', async(req, res) => {
    console.log("resetPasswdZPP");
    console.log(req.query);
    // Open a database connection
    sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
        if (err) {
            console.log('Error Conexión DB');
            return console.error(err.message);
        }
        console.log('[Usuarios.resetPass] Connected to the SQlite file database.');
    });
    let sql = "select * from USUARIOS where C_USUARIO='" + req.query.UserEMail +"';";
    ret = sqlite3.run(sql);
    console.log(ret[0]);
    if(ret[0] != undefined){
        try{
            let userSalt = await bcrypt.genSalt();
            let newPass = makeid(12);
            const hashedPassword = await bcrypt.hash(newPass, 10);
            // const hashedPassword = await bcrypt.hash(req.query.UserPasswd, userSalt);
            
            let usuario = {
                EMailUsuario : req.query.UserEMail, 
                passwordUsuario : hashedPassword,
                salt : userSalt
            }
            // Open a database connection
            sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
                if (err) {
                    console.log('Error Conexión DB');
                    return console.error(err.message);
                }
                console.log('[Usuarios.postUsuarios] Connected to the SQlite file database.');
            });
            
            let sql = "Update USUARIOS set PASSWORD = '" + hashedPassword + "', NECESARIO_CAMBIO_PASSWD = 'S' where C_USUARIO = '" + usuario.EMailUsuario + "';";
            console.log(sql);
            ret = sqlite3.run(sql);
            console.log(ret);
            let sql2 = "select * from USUARIOS";
            ret = sqlite3.run(sql2);
            sqlite3.close();
            
            res.send({estado: "OK", passwd: newPass});
            // res.status(201).send;
        }
        catch{
            res.status(500).send();
        }
    }
    else{
        // res.send("USUARIO NO EXISTENTE");
        res.status(505).send();
    }
    
    
});


router.post('/editarPasswdZPP', async(req, res) => {
    console.log("editarPasswdZPP");
    console.log(req.query);
    // Open a database connection
    sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
        if (err) {
            console.log('Error Conexión DB');
            return console.error(err.message);
        }
        console.log('[Usuarios.resetPass] Connected to the SQlite file database.');
    });
    let sql = "select * from USUARIOS where C_USUARIO='" + req.query.UserEMail +"';";
    ret = sqlite3.run(sql);
    console.log(ret[0]);
    if(ret[0] != undefined){
        try{
            let oldPass = req.query.UserPasswd;
            let newPass = req.query.UserNewPasswd;
            if(await bcrypt.compare(oldPass, ret[0].PASSWORD)){
                const hashedPassword = await bcrypt.hash(newPass, 10);
                // Open a database connection
                sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
                    if (err) {
                        console.log('Error Conexión DB');
                        return console.error(err.message);
                    }
                    console.log('[Usuarios.editPass] Connected to the SQlite file database.');
                });
                
                let sql = "Update USUARIOS set PASSWORD = '" + hashedPassword + "', NECESARIO_CAMBIO_PASSWD = 'N' where C_USUARIO = '" +  req.query.UserEMail + "';";

                console.log('aqui llega' + sql);
                console.log(sql);
                ret = sqlite3.run(sql);
                sqlite3.close();
                console.log("Contraseña actualizada");
                res.send({estado: "OK"});
            }
            else{
                // res.send("ACCESO DENEGADO");
                res.status(503).send();
            }        
            // res.status(201).send;
        }
        catch{
            res.status(500).send();
        }
    }
    else{
        // res.send("USUARIO NO EXISTENTE");
        res.status(505).send();
    }
    
    
});






// Obtención de los permisos de un usuario pasado por parametros
router.get('/getPermisos', (req, res) => {
    console.log("Get Permisos");
    // Open a database connection
    sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
        if (err) {
            console.log('Error Conexión DB');
            return console.error(err.message);
        }
        console.log('[Permisos.getPermisos] Connected to the SQlite file database.');
        });
        console.log(req.query);
        let sql = "SELECT * from PERMISOS WHERE C_USUARIO = '" + req.query.UserEmail + "';";
        ret = sqlite3.run(sql);
        console.log('RET');
        console.log(ret);
        sqlite3.close();
        if(ret[0] == undefined){
            // res.send("ACCESO DENEGADO");
            res.status(504).send();
        }
        else{
            res.send(ret);
        }
    
})


// Creación de un nuevo usuario
router.post('/postPermisos',multerUpload, (req, res) => {
    console.log("Post Permisos");
    console.log("Nombre del archivo");
    console.log(req.file.filename);    
    // Open a database connection
    let permiso = {
        CodigoUsuario : req.query.UserEmail,
        EstadoPermiso : "Pendiente",
        CodigoZona : req.query.CodZona,
        CodigoCategoria : req.query.CodCat,
        CodigoSubcategoria : req.query.CodaSubcat,
        FechaInicio : req.query.FecIni,
        FechaFin : req.query.FecFin,
        ValidacionRequerida : req.query.reqValid//"N" no, "S" si
    }
    if(permiso.ValidacionRequerida == "N"){
        permiso.EstadoPermiso = "Aprobado";
    }
    let fechaCompleta = devolverFecha();
    
    console.log(fechaCompleta);

    sqlite3.connect(path.join(__dirname, '../database/zppApp.db'), (err) => {
        if (err) {
            console.log('Error Conexión DB');
            return console.error(err.message);
        }
        console.log('[Permisos.postPermisos] Connected to the SQlite file database.');
        });
        console.log(req.query);
      let sql = "INSERT INTO USUARIOS (C_USUARIO, ESTADO, C_ZONA, C_CATEG, C_SUBCATEG, FEC_INI, FEC_FIN, FEC_CREACION) VALUES ('" + permiso.EmailUsuario + "', '"+ permiso.EstadoPermiso +"', '" + permiso.CodigoZona + "', '" + permiso.CodigoCategoria + "', '" + permiso.CodigoSubcategoria + "', '" + permiso.FechaInicio + "', '" + permiso.FechaFin + "', '" + fechaCompleta + "')";
      ret = sqlite3.run(sql);

      sqlite3.close();
})

function devolverFecha(){
    const d = new Date();

    let dia = d.getDate();
    let mes = (d.getMonth() + 1);
    let anio = d.getFullYear();
    let hora = d.getHours();
    let minutos = d.getMinutes();
    let segundos = d.getSeconds();

    if (dia.toString().length == 1){
        dia = "0" + dia;
    }
    if (mes.toString().length== 1){
        mes = "0" + mes;
    }
    if (hora.toString().length == 1){
        hora = "0" + hora;
    }
    if (minutos.toString().length== 1){
        minutos = "0" + minutos;
    }
    if (segundos.toString().length == 1){
        segundos = "0" + segundos;
    }
     

    let fechaFormateada = dia + "/" + mes + "/"+ anio + " " + hora + ":" + minutos + ":" + segundos;
    return fechaFormateada;
}


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


module.exports = router;