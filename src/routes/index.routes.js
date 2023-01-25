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
    dest: path.join(__dirname, '../public/tablasMatriculas'),
    fileFilter: (req,file,cb) => {
        const fileTypes = /csv/;
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname))
        if(mimetype && extName){
            return cb(null, true);
        }
        cb("Error: el archivo debe ser una imagen valida")
    }
}).single("foto");


router.use(Router.urlencoded());


router.get('/', (req, res) => {
    // res.send('Hello World!')
    res.send(devolverFecha())
  })


  
  
  router.post("/altasUsuarioZPPencriptacion", async (req,res) =>{
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
            
            let sql = "INSERT INTO USUARIOS (C_USUARIO, DNI_CIF, DENOMIMACION, CORREO_E, TLF, TIPO_VIA, NOMBRE_VIA, NUM_VIA, PISO, LETRA, INFORM_ADIC, COD_POSTAL, PASSWORD, SALT) VALUES ('" + usuario.EMailUsuario + "', '"+ usuario.docIdentUsuario +"', '" + usuario.denomUsuario + "', '" + usuario.EMailUsuario + "', " + usuario.telefUsuario + ", '" + usuario.tipoViaUsuario + "', '" + usuario.nomViaUsuario + "', " + usuario.numUsuario + ", " + usuario.pisoUsuario + ", '" + usuario.letraUsuario + "', '" + usuario.infoAdicUsuario + "', '" + usuario.codPostalUsuario + "', '" + usuario.passwordUsuario + "', '" + usuario.salt + "')";
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

router.post('/loginZPP', async(req, res) => {
    console.log("loginZPP");
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
        // res.send("ACCESO DENEGADO");
        res.status(502).send();
    }
    else{
        console.log(ret[0].PASSWORD);
        sqlite3.close();
        if(await bcrypt.compare(req.query.UserPasswd, ret[0].PASSWORD)){
            res.send({respuesta: "Acceso Concedido"});
        }
        else{
            // res.send("ACCESO DENEGADO");
            res.status(503).send();
        }
    }
    
})

router.get('/getPermisos', (req, res) => {
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
            res.send({});
        }
        else{
            res.send(ret);
        }
    
})

router.post('/postPermisos', (req, res) => {
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


module.exports = router;