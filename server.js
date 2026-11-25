const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: 'unimagdalena-reportes',
    resave: false,
    saveUninitialized: false
}));

const usuarios = {
  "user1@unimagdalena.edu.co": {
    password: "7531",
    role: "user"
  },

  "user2@unimagdalena.edu.co": {
    password: "8642",
    role: "user"
  },

  "admin@unimagdalena.edu.co": {
    password: "4321",
    role: "admin"
  }
};

let reportes = [];
let ultimoReporte = null;


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/login', (req, res) => {

  const { correo, password } = req.body;

  if (
    usuarios[correo] &&
    usuarios[correo].password === password
    
  ) {

    req.session.usuario = correo;

    if (usuarios[correo].role === "admin") {

      res.redirect('/admin');

    } else {

      res.redirect(`/reportes?correo=${correo}`);

    }

  } else {

    res.send(`
      <!DOCTYPE html>
      <html lang="es">

        <head>

          <meta charset="UTF-8">

          <title>Acceso no válido</title>

          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">

          <style>

           *{
              margin:0;
              padding:0;
              box-sizing:border-box;
            }

            body{

              font-family:Poppins,sans-serif;

              background:
              linear-gradient(
              rgba(0,0,0,.75),
              rgba(0,0,0,.85)
              ),
              url('/img/unimagdalena.jpg');

              background-size:cover;
              background-position:center;

              height:100vh;

              display:flex;
              justify-content:center;
              align-items:center;

              color:white;
            }

            .card{

              background:rgba(15,25,50,.88);

              padding:60px;

              border-radius:25px;

              text-align:center;

              max-width:700px;

              box-shadow:
              0 0 30px rgba(244,197,66,.25);

            }

            h1{

              font-family:Montserrat,sans-serif;

              font-size:3rem;

              margin-bottom:20px;

              color:#F4C542;
            }

            p{

              font-size:1.15rem;

              margin-bottom:35px;

              color:#d8d8d8;

              line-height:1.6;
            }

            .btn{

              display:inline-block;

              text-decoration:none;

              background:#f4c542;

              color:black;

              font-weight:700;

              padding:18px 35px;

              border-radius:15px;

              transition:.3s;
            }

            .btn:hover{

              transform:translateY(-3px);
            }

          </style>

        </head>

        <body>

          <div class="card">

            <h1>ACCESO NO VÁLIDO</h1>

            <p>

              El correo institucional o la contraseña ingresados no coinciden con los registros del sistema.

              Por favor verifica tus datos e inténtalo nuevamente.

            </p>

            <a href="/" class="btn">
              VOLVER A INICIAR SESIÓN
            </a>

          </div>

        </body>

      </html>

    `);

  }

});

app.get('/reportes', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'reportes.html'));
});

app.post('/reportes', (req, res) => {

  const { tipo, lugar, descripcion } = req.body;
  const correo = req.session.usuario;
  console.log("Correo recibido:", correo);

  reportes.push({
    tipo,
    lugar,
    descripcion,
    usuario: correo,
    estado:"Pendiente",
    fecha: new Date().toLocaleString()
  });

  ultimoReporte = new Date();

  function diasSinReportes(){

    if(!ultimoReporte){
      return 0;
    }

    const hoy = new Date();

    const diferencia =
        hoy - ultimoReporte;

    return Math.floor(
        diferencia /
        (1000 * 60 * 60 * 24)
    );

  }

  res.send(`
    <!DOCTYPE html>
    <html lang="es">

      <head>

        <meta charset="UTF-8">

        <title>Reporte Enviado</title>

        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">

        <style>

          *{
            margin:0;
            padding:0;
            box-sizing:border-box;
          }

          body{

            font-family:Poppins,sans-serif;

            background:
            linear-gradient(
              rgba(0,0,0,.75),
              rgba(0,0,0,.85)
            ),
            url('/img/unimagdalena.jpg');
 
            background-size:cover;
            background-position:center;

            height:100vh;

            display:flex;
            justify-content:center;
            align-items:center;

            color:white;
          }

          .card{

            background:rgba(15,25,50,.85);

            padding:60px;

            border-radius:25px;

            text-align:center;

            max-width:700px;

            backdrop-filter:blur(8px);

            box-shadow:
            0 0 30px rgba(244,197,66,.25);

          }

          h1{

            font-family:Montserrat,sans-serif;

            font-size:3rem;

            margin-bottom:20px;
          }

          p{

            font-size:1.2rem;

            margin-bottom:35px;

            color:#d8d8d8;
          }

          .btn{

            display:inline-block;

            text-decoration:none;

            background:#f4c542;

            color:black;

            font-weight:700;

            padding:18px 35px;

            border-radius:15px;

            transition:.3s;
          }

          .btn:hover{

            transform:translateY(-3px);

            box-shadow:
            0 0 20px rgba(244,197,66,.5);
          }

        </style>

      </head>

      <body>

        <div class="card">

          <h1>
            ¡GRACIAS POR TU COMPROMISO!
          </h1>

          <p>
            Tu reporte ha sido registrado correctamente.
            Gracias por ayudar a mantener los espacios de la Universidad del Magdalena en mejores condiciones para toda la comunidad.
          </p>

          <a href="/reportes" class="btn">
            REALIZAR OTRO REPORTE
          </a>

        </div>

      </body>

    </html>
  `);

});

app.get('/admin', (req, res) => {

  if(req.session.usuario !== "admin@unimagdalena.edu.co"){

    return res.redirect("/");

  }

  let filas = "";

  reportes.forEach(r => {

    filas += `
      <tr>
        <td>${r.tipo}</td>
        <td>${r.lugar}</td>
        <td>${r.descripcion}</td>
        <td>${r.usuario}</td>
        <td>${r.estado}</td>
        <td>${r.fecha}</td>
      </tr>
    `;

  });

  res.send(`
    <!DOCTYPE html>
    <html lang="es">

      <head>

        <meta charset="UTF-8">

        <title>Panel Administrativo</title>

        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">

        <style>

          *{
            margin:0;
            padding:0;
            box-sizing:border-box;
          }

          body{

            font-family:Poppins,sans-serif;

            background:#0b1020;

            color:white;

            padding:40px;
          }

          .header{

            display:flex;

            justify-content:space-between;

            align-items:center;

            margin-bottom:30px;
          }

          h1{

            font-family:Montserrat,sans-serif;
          }

          .btn{

            background:#f4c542;

            color:black;

            text-decoration:none;

            padding:12px 24px;

            border-radius:12px;

            font-weight:700;
          }

          .table-container{

            background:#151d31;

            border-radius:20px;

            overflow:hidden;

            box-shadow:
            0 0 20px rgba(244,197,66,.15);
          }

          table{

            width:100%;

            border-collapse:collapse;
          }

          th{

            background:#f4c542;

            color:black;

            padding:18px;

            text-align:left;
          }

          td{

            padding:18px;

            border-bottom:1px solid rgba(255,255,255,.1);
          }

          tr:hover{

            background:#1d2742;
          }

          .no-data{

            padding:30px;

            text-align:center;
          }

        </style>

      </head>

      <body>

        <div class="header">

          <h1>Panel Administrativo</h1>

          <div class="stats">

            <div class="stat-card">

              <h2>${reportes.length}</h2>

              <p>Total reportes</p>

            </div>

          </div>

          <div>

            <a href="/excel" class="btn">
              📊 Exportar Excel
            </a>

            <a href="/" class="btn">
              Cerrar sesión
            </a>

          </div>

          

        </div>

        <div class="table-container">

          <table>
                     
            <tr>
            <th>Tipo</th>
            <th>Lugar</th>
            <th>Descripción</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Fecha</th>
            </tr>

            ${filas || `
              <tr>
                <td colspan="4" class="no-data">
                  No hay reportes registrados
                </td>
              </tr>
            `}

          </table>

        </div>

      </body>

    </html>
  `);

  

});

app.get('/excel', (req, res) => {

    const worksheet =
        XLSX.utils.json_to_sheet(reportes);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Reportes"
    );

    const rutaArchivo =
        path.join(
            __dirname,
            'reportes.xlsx'
        );

    XLSX.writeFile(
        workbook,
        rutaArchivo
    );

    res.download(rutaArchivo);

});

app.get('/contador', (req, res) => {

    res.json({
        dias: diasSinReportes()
    });

});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});