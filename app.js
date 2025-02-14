require("dotenv").config();  // Carga la configuración de variables de entorno

const { neon } = require("@neondatabase/serverless");
const express = require('express');
const app = express();

// Definir el puerto
const PORT = 3000;
const sql = neon(process.env.DATABASE_URL);  // Crea la conexión con Neon

// Servir archivos estáticos como CSS
app.use(express.static('public'));

// Ruta principal
app.get('/', async (req, res) => {
    try {
        // Consulta para obtener todos los datos de la tabla t_tarea
        const result = await sql`SELECT * FROM t_tarea`;

        // Renderizamos los datos en formato HTML con un diseño más atractivo
        let html = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Tareas</title>
            <link rel="stylesheet" href="/styles.css"> <!-- Enlazamos el archivo CSS -->
        </head>
        <body>
            <div class="container">
                <h1>Lista de Tareas</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>`;

        result.forEach(t_tarea => {
            html += `
            <tr>
                <td>${t_tarea.id}</td>
                <td>${t_tarea.titulo}</td>
                <td>${t_tarea.descripcion}</td>
            </tr>`;
        });

        html += `
                    </tbody>
                </table>
            </div>
        </body>
        </html>`;

        res.send(html);  // Enviar el HTML con los datos de las tareas
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send('Error al obtener los datos de la base de datos');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
