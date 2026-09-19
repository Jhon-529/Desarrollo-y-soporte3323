# Tienda Express

Proyecto de Evidencia AA2 — Curso **Desarrollo y soporte de aplicaciones multiplataforma** (CERTUS).

Aplicación web de comercio electrónico ("Mi emprendimiento online") con arquitectura de **3 capas** desplegada en un entorno **Cloud Computing**.

## Integrantes
- Caldas Tenorio Joaquín Ismael
- Chachi Palpa Jhonnyer José
- Meza Ortega Denis Brandon
- Zambrano Santiago Luis Humberto
- Terry Stalyn Zanga Peña

## Arquitectura

| Capa | Tecnología |
|---|---|
| Front-End | HTML5, CSS3, JavaScript, Bootstrap |
| Back-End | Python + Flask |
| Base de datos | MySQL |
| Pagos | Yape, Plin |
| Despliegue | Cloud (AWS / Heroku) |

## Estructura del repositorio

```
tiendaexpress/
├── frontend/     → HTML, CSS, JS (Inicio, Catálogo, Carrito, Registro/Login, Contacto)
├── backend/      → Python Flask (rutas, lógica de negocio)
├── database/     → Scripts SQL (tablas, relaciones)
├── config/       → Archivos de conexión y despliegue
└── .github/
    └── workflows/  → Integración continua (CI)
```

## Flujo de trabajo con Git (multiusuario)

1. Cada integrante trabaja en su propia rama:
   ```bash
   git checkout -b feature/nombre-integrante
   ```
2. Se hacen commits descriptivos del avance.
3. Se sube la rama y se abre un **Pull Request** hacia `main`:
   ```bash
   git push origin feature/nombre-integrante
   ```
4. Se revisa el código (code review) y se hace el **merge** a `main`.
5. Al hacer push/merge a `main`, se dispara automáticamente el workflow de **GitHub Actions** (ver `.github/workflows/ci.yml`).

## Cómo ejecutar el backend localmente

```bash
cd backend
pip install -r requirements.txt
python app.py
```

La app quedará disponible en `http://192.168.1.10:5000` (o `http://localhost:5000` en local).

## Base de datos

Importar el esquema inicial:

```bash
mysql -u usuario -p tiendaexpress < database/schema.sql
```

Servidor de base de datos: `192.168.1.20:3306` (conexión mediante HTTPS y credenciales encriptadas, ver `config/`).

## Despliegue

Ver `config/deploy.md` para las variables de entorno y pasos de publicación en la nube.
