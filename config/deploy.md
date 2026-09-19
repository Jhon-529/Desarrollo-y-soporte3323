# Guía de despliegue - Tienda Express

## 1. Requisitos
- Cuenta en el proveedor Cloud (AWS o Heroku)
- Servidor MySQL accesible remotamente
- Variables de entorno configuradas (ver `.env.example`)

## 2. Pasos
1. Clonar el repositorio en el servidor.
2. Copiar `config/.env.example` a `.env` y completar las credenciales.
3. Instalar dependencias: `pip install -r backend/requirements.txt`
4. Importar el esquema de base de datos: `mysql -u usuario -p tiendaexpress < database/schema.sql`
5. Iniciar la aplicación: `python backend/app.py`
6. Configurar el dominio/URL pública apuntando al servidor de aplicación (192.168.1.10:5000).
7. Habilitar HTTPS y verificar que las credenciales viajen encriptadas.

## 3. Integración continua
Cada push o merge a `main` dispara el workflow `.github/workflows/ci.yml`, que:
- Instala dependencias del backend.
- Verifica que el código compile sin errores.
- Corre pruebas automáticas (si existen).
- Valida que los archivos principales del frontend existan.
