# Curso Backend - MERN Stack: Proyecto Final
## E-commerce project
### *Estudiante:* Gonzalo Leonel Gramajo

**COMISIÓN:** 30945

**NOMBRE DEL PROYECTO:** Store Wars.

**TEMÁTICA:** Tienda online de venta de productos referidos a Star Wars y su universo cinematográfico.

### Descripciones generales
Desarrollo de backend de una aplicación e-commerce para vender productos referidos a Star Wars. Contiene: 
- Las rutas necesarias para listar productos existentes, ingresar productos nuevos, borrar y modificar sus detalles, así como interactuar con el carrito de compras.
- Se implementó una API RESTful con los verbos get, post, put y delete para cumplir con las acciones necesarias.
- Se brindó al frontend un mecanismo de ingreso autorizado al sistema
basado en JWT (Json Web Token).
- Los productos ingresados se almacenan en una base de datos MongoDB.
- El usuario puede registrar sus credenciales de acceso (email y password) para
luego poder ingresar a su cuenta. Estas credenciales son guardadas en la
base de datos MongoDB con contraseña encriptada.
- El cliente tiene una sesión activa de usuario con tiempo de expiración configurable mediante variable de entorno.
- Se implementó un canal de chat basado en websockets, el cual permite atender
las consultas del cliente.
- La arquitectura del servidor está basada en capas (MVC)
- El servidor puede tomar configuraciones desde un archivo externo.
- Se dispone de una vista creada con ejs, que permite ver la configuración del
servidor.
- Se envía un mail a una casilla configurable, por cada registro nuevo de usuario
y con cada orden de compra generada.

### Implementación de Frontend
No se implementará Frontend, salvo en las situaciones donde sea necesario para realizar las pruebas. Este frontend de pruebas esta implementado mediante ejs para:
- El **chat**, ya que se necesita comprobar el funcionamiento del socket.
- El **ingreso al sistema**, ya que se debe comprobarl el correcto inicio de sesión con passport.
- La **vista de configuración** del servidor.

### Tecnologías usadas
- Node.js
- MongoDB
- Passport JWT
- Mongoose
- Bcrypt
- Socket.io
- Dotenv
- Ejs
- Nodemailer

### Descripciones específicas

**INICIO** -> al requerir la ruta `/`:
- Se muestra un menú de ingreso al sistema con email y password así como también la posibilidad de registro de un nuevo usuario.
- El menú de registro consta del nombre completo del cliente, número telefónico, email y campo de password duplicado para verificar coincidencia.
- Si un usuario se loguea exitosamente o está en sesión activa, la ruta '/' hará una re dirección a la ruta `/productos`.
- La ruta `/productos` devuelve el listado de todos los productos disponibles para la compra.
- La ruta `/productos/:categoria` devuelve los productos por la categoría requerida.
- Los ítems pueden ser agregados al carrito de compras y listados a través de la ruta `/carrito`.
- Se puede modificar y borrar por su id a través de la ruta `/carrito:id`.

**FLOW** -> Se puede solicitar un producto específico con la ruta `/productos/:id`, donde id es el id del item generado por MongoDB y devuelve la descripción del producto ( foto, precio, selector de cantidad). Si se ingresa a `/productos/:id` y el producto no existe en MongoDB, se respinde con un mensaje adecuado que indica algo relacionado a que el producto no existe.

**MONGODB** -> se implementaron las siguientes colecciones:
- *usuarios:* clientes registrados
- *productos:* catálogo completo
  * Link para foto (se almacena de modo estático en la página en una subruta </images/:productoid>)
  * Precio unitario
  * Descripción
  * Categoría
- *mensajes:* chat del usuario (preguntas y respuestas)
  * Email: del usuario que pregunta o al que se responde
  * Tipo (‘usuario’ para preguntas ó ‘sistema’ para respuestas)
  * Fecha y hora
  * Cuerpo del mensaje
- *carrito:* orden temporal de compra
  * Email
  * Fecha y hora
  * Items con sus cantidades
  * Dirección de entrega
- *ordenes:* las órdenes generadas, que deben incluir los productos, descripciones y los precios al momento de la compra.
  * Ítems: las órdenes pueden tener productos surtidos, cada uno con su cantidad
  * Número de orden: Se extrae de la cantidad de órdenes almacenadas
  * Fecha y hora
  * estado ( por defecto en ‘generada’)
  * Email de quién realizó la orden

**ENVIO DE MAILS** -> Finalizada la orden, se envia un mail a la dirección de la cuenta con los detalles de la orden.

**ARCHIVO DE CONFIGURACIÓN** -> Se dispone de un archivo de configuración externo con opciones para desarrollo y otras para producción, que son visualizadas a través de la vista `/config`. Como parámetros de configuración esta el puerto de escucha del servidor, la url de la base de datos, el mail que recibirá notificaciones del backend, tiempo de expiración de sesión y los que sea necesario incluir.

**CANAL DE CHAT** -> Se cuenta con un canal de chat general donde el usuario enviará los mensajes en la ruta `/chat` y en `/chat/:email` puede ver sólo los suyos. Se utiliza la colección mensajes en MongoDB. La tecnología de comunicación es Websockets. El servidor implementa una vista, utilizando ejs, para visualizar todos los mensajes y poder responder individualmente a ellos, eligiendo el email de respuesta.