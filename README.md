# Template: ts-node-express-mysql-typeorm-template
Repo tipo plantilla para estructuracion de carpetas y dependencias de proyecto 
> [!IMPORTANT] 
> Se debe crear un archivo .env en la raiz del proyecto con los atributos:  
**DB_TYPE**= tipo de base de datos; por defecto, ```"postgres"```.\
**DB_URL**= url de la base de datos.\
**PORT**= puerto en el que corre el servidor localmente; por defecto, ```1234```.\
**SUPABASE_DB_KEY**= clave de la base de datos (provista por Supabase).\
**SUPABASE_DB_URL_AUTH**= url del servicio de autenticación de Supabase (para esa DB).\
**JWT_SECRET**= secreto utilizado por Supabase para generar los tokens.

Las variables de entorno son cargadas en una clase en config.ts, la cual luego se pasa como argumento a ```AppDataSource``` en data-source.ts.

## Documentación Swagger 🟢
- Local  
  http://localhost:3000/docs/
  
- Deploy  
  https://api-danielbot-mern.onrender.com/docs/
  
### Instructivo de Documentación con Swagger 📄
Este instructivo guiará del uso de Swagger para probar la API de DanielBot. Se detallan los pasos y consideraciones clave para utilizar Swagger.

#### Seguridad 🔓
##### 1- Registro de usuario:
- Usar la ruta `signUpWhitUser` para registrar un nuevo usuario.
- O pasar al paso dos (2) y utilizar las siguentes credenciales: (RECOMENDADO)
```bash
{
    "email": "email@gmail.com",
    "password": "probando"
}
```
##### 2- Iniciar sesión:
- Usar la ruta `signIn` para iniciar sesión con las credenciales registradas.
- La respuesta de esta ruta incluirá un token de autenticación.
##### 3- Autorización:
- Copia el token proporcionado en la respuesta de `signIn`.
- Hacer clic en el botón **Authorize** en la interfaz de Swagger.
 > *Authorize* se encuentra en la parte superior derecha de la vista de Swagger.
<p align="center">
  <img src="https://github.com/RST-Sistemas/API-danielbot-MERN/assets/128536319/ac165dca-c906-4b69-8bbd-7d1ecbd0f8ff" alt="image"/>
</p>  

- Ingresa el token en el siguiente formato: `Bearer <tu_token>`, donde <tu_token> es el token obtenido.  

## UML 
<p align="center">
  <img src="https://github.com/RST-Sistemas/API-danielbot-MERN/assets/128536319/2aba8f21-5057-4f49-8090-fd106bbc12b6" alt="Diagrama UML">
</p>  

## Lista de comandos 
1- Instalar/actualizar dependencias: 
```bash
npm i
```
2- Correr el servidor: 
```bash
npm run dev
```
## Otros comandos
- Actualizar la documentación de swagger: 
```bash
npm run swagger
```
> [!NOTE]
> La documentación fue realizada con swagger autogen (https://swagger-autogen.github.io/docs/)
