"""
Conexión a la base de datos MySQL (servidor: 192.168.1.20:3306)
Usa variables de entorno definidas en config/.env
"""

import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "192.168.1.20"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER", "usuario"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "tiendaexpress"),
    )
