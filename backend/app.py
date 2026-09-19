"""
Tienda Express - Backend
Curso: Desarrollo y soporte de aplicaciones multiplataforma
"""

from flask import Flask, jsonify, render_template

app = Flask(__name__, template_folder="../frontend", static_folder="../frontend", static_url_path="")

# ----------------------------
# Rutas principales (páginas)
# ----------------------------

@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/catalogo")
def catalogo():
    return render_template("catalogo.html")


@app.route("/carrito")
def carrito():
    return render_template("carrito.html")


@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/contacto")
def contacto():
    return render_template("contacto.html")


# ----------------------------
# API (lógica de negocio)
# ----------------------------

@app.route("/api/productos")
def api_productos():
    productos = [
        {"id": 1, "nombre": "Producto A", "precio": 29.90},
        {"id": 2, "nombre": "Producto B", "precio": 49.90},
        {"id": 3, "nombre": "Producto C", "precio": 19.90},
    ]
    return jsonify(productos)


@app.route("/api/pedido", methods=["POST"])
def api_pedido():
    # Aquí iría la lógica de registro de pedidos en MySQL
    return jsonify({"status": "ok", "mensaje": "Pedido registrado correctamente"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
