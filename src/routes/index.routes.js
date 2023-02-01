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


const multerUploadcsv = multer({
    storage: storage,
    dest: path.join(__dirname, '../public/utilDocs/csv'),
    fileFilter: (req,file,cb) => {
        const fileTypes = /csv/;
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname))
        if(mimetype && extName){
            return cb(null, true);
        }
        cb("Error: el archivo debe ser una imagen valida")
    }
}).single("csv");


const multerUploadAlbaran = multer({
    storage: storage,
    dest: path.join(__dirname, '../public/utilDocs/albaranes'),
    fileFilter: (req,file,cb) => {
        const fileTypes = /pdf|jpg|png/;
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname))
        if(mimetype && extName){
            return cb(null, true);
        }
        cb("Error: el archivo debe ser una imagen valida")
    }
}).single("csv");


const multerUploadDNI = multer({
    storage: storage,
    dest: path.join(__dirname, '../public/utilDocs/dni'),
    fileFilter: (req,file,cb) => {
        const fileTypes = /pdf|jpg|png/;
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname))
        if(mimetype && extName){
            return cb(null, true);
        }
        cb("Error: el archivo debe ser una imagen valida")
    }
}).single("dni");

const multerUploadEscritura = multer({
    storage: storage,
    dest: path.join(__dirname, '../public/utilDocs/escrituras'),
    fileFilter: (req,file,cb) => {
        const fileTypes = /pdf|jpg|png/;
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname))
        if(mimetype && extName){
            return cb(null, true);
        }
        cb("Error: el archivo debe ser una imagen valida")
    }
}).single("escritura");

const multerUploadFoto = multer({
    storage: storage,
    dest: path.join(__dirname, '../public/utilDocs/fotografias'),
    fileFilter: (req,file,cb) => {
        const fileTypes = /pdf|jpg|png/;
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname))
        if(mimetype && extName){
            return cb(null, true);
        }
        cb("Error: el archivo debe ser una imagen valida")
    }
}).single("fotoUsuario");

const multerUploadDocVehiculo = multer({
    storage: storage,
    dest: path.join(__dirname, '../public/utilDocs/docVehiculos'),
    fileFilter: (req,file,cb) => {
        const fileTypes = /pdf|jpg|png/;
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname))
        if(mimetype && extName){
            return cb(null, true);
        }
        cb("Error: el archivo debe ser una imagen valida")
    }
}).single("doc");

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
    if(ret[0] == undefined){ //Comprobado que no existe ningun usuario existente con el email pasado por parametro
        try{
            let userSalt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(req.query.UserPasswd, 10);            
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
            res.status(500).send(); //La encriptación de la contraseña o la inserción en la base de datos ha fallado
        }
    }
    else{
        // res.send("USUARIO YA EXISTENTE");
        res.status(501).send();//Ya existe un usuario con ese nombre
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
        res.status(502).send();//el usuario especificado no se ha encontrado
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
            res.status(503).send();//Contraseña incorrecta
        }
    }
    
})


//Recibe un correo electronico del cual se quiere reestablecer la contraseña, genera una nueva contraseña aleatoria y se devuelve al usuario para que la utilice en su siguiente inicio de sesión. Esa contraseña solo será valida para un uso, despues se obligará al usuario a cambiar la contraseña.
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
        //El usuario especificado se ha encontrado
        try{
            let userSalt = await bcrypt.genSalt();
            let newPass = randomPasswd(12);
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
            res.status(500).send(); //La encriptación de la contraseña o la inserción en la base de datos ha fallado
        }
    }
    else{
        // res.send("USUARIO NO EXISTENTE");
        res.status(505).send();//El usuario especificado no se ha encontrado
    }
    
    
});

//Cambio de contraseña
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
                res.status(503).send();//La contraseña antigua no es correcta
            }        
            // res.status(201).send;
        }
        catch{
            res.status(500).send(); //La encriptación de la contraseña o la inserción en la base de datos ha fallado
        }
    }
    else{
        // res.send("USUARIO NO EXISTENTE");
        res.status(505).send();// El usuario especificado no se ha encontrado
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
router.post('/postPermisos', (req, res) => {
    console.log("Post Permisos");
    // Open a database connection
    let permiso = {
        CodigoUsuario : req.query.UserEmail,
        EstadoPermiso : "Pendiente",
        CodigoZona : req.query.CodZona,
        CodigoCategoria : req.query.CodCat,
        CodigoSubcategoria : req.query.CodSubcat,
        FechaInicio : req.query.FecIni,
        FechaFin : req.query.FecFin,
        Matricula : req.query.Matricula,
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
      let sql = "INSERT INTO USUARIOS (C_USUARIO, ESTADO, C_ZONA, C_CATEG, C_SUBCATEG, FEC_INI, FEC_FIN, FEC_CREACION, MATRICULA) VALUES ('" + permiso.EmailUsuario + "', '"+ permiso.EstadoPermiso +"', '" + permiso.CodigoZona + "', '" + permiso.CodigoCategoria + "', '" + permiso.CodigoSubcategoria + "', '" + permiso.FechaInicio + "', '" + permiso.FechaFin + "', '" + fechaCompleta + "', '" + permiso.Matricula + "')";
      ret = sqlite3.run(sql);

      sqlite3.close();
})

//Devuelve la fecha y la hora en formato DD/MM/YYYY HH:mm:SS
function devolverFecha(){
    const d = new Date();

    let dia = d.getDate();
    let mes = (d.getMonth() + 1);
    let anio = d.getFullYear();
    let hora = d.getHours();
    let minutos = d.getMinutes();
    let segundos = d.getSeconds();


    //En los siguientes campos, si por ejemplo es el dia 4 de enero, devuelve 4/1/2xxx, por lo que se inserta un 0 antes para acomodar su formato a 04/01/2xxx
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

//Genera una cadena de texto alfanumerica de la longitud que se le indica por parametro
function randomPasswd(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


router.post("/photoUpload", multerUpload, (req,res) =>{
    console.log('DATOS RECIBIDOS: ');
    console.log(req);
    let codIncidencia = req.body.codIncidencia;
    let ficheroImagen = req.file.filename;
    // Open a database connection
    sqlite3.connect(path.join(__dirname, '../database/smartrsu.db'), (err) => {
    if (err) {
        console.log('Error Conexión DB');
        return console.error(err.message);
    }
    console.log('[imagenes.postImagenes] Connected to the SQlite file database.');
    });

    let sql = "INSERT INTO imagenes (codIncidencia, ficheroImagen) VALUES ('" + codIncidencia + "', '" + ficheroImagen + "');";
    ret = sqlite3.run(sql);

    sqlite3.close();

    res.send("Uploaded Photo");

  });

module.exports = router;