/* ============ PRODUCTOS ============ */
/* Las imágenes van en la carpeta "img" junto a index.html.
   Para cambiar una foto, cambia el nombre en "imagen". */
const productos = [
  { id:1,  nombre:'Detergente 1L',        precio:12.90, imagen:'img/detergente.jpg' },
  { id:2,  nombre:'Arroz 1kg',            precio:22.50, imagen:'img/arroz.jpg' },
  { id:3,  nombre:'Agua cielo 625ml',      precio:9.90,  imagen:'img/agua.jpg' },
  { id:4,  nombre:'Shampo 400ml',        precio:18.00, imagen:'img/shampoo.jpg' },
  { id:5,  nombre:'Aceite Primor 1L',    precio:8.50,  imagen:'img/aceite.jpg' },
  { id:6,  nombre:'Jabón x3',             precio:7.90,  imagen:'img/jabon.jpg' },
  { id:7,  nombre:'Jugo naranja 1L',      precio:6.50,  imagen:'img/jugo.jpg' },
  { id:8,  nombre:'Papel higiénico x12',  precio:16.90, imagen:'img/papel.jpg' },
  { id:9,  nombre:'Fideos 500g',          precio:3.80,  imagen:'img/fideos.jpg' },
  { id:10, nombre:'Azúcar rubia 1kg',     precio:4.90,  imagen:'img/azucar.jpg' },
  { id:11, nombre:'Leche Gloria 350ml',   precio:23.40, imagen:'img/leche.jpg' },
  { id:12, nombre:'Atún Florida',      precio:15.60, imagen:'img/atun.jpg' },
  { id:13, nombre:'Galletas de soda x6',  precio:5.90,  imagen:'img/galletas.jpg' },
  { id:14, nombre:'Lavavajilla 500ml',    precio:7.20,  imagen:'img/lavavajilla.jpg' },
  { id:15, nombre:'Pasta dental 100ml',   precio:6.90,  imagen:'img/pasta-dental.jpg' },
  { id:16, nombre:'Café Nescafe 170g',precio:19.90, imagen:'img/cafe.jpg' },
];

/* ============ ALMACENAMIENTO ============ */
function leer(clave, porDefecto) {
  try {
    const v = JSON.parse(localStorage.getItem(clave));
    return v === null ? porDefecto : v;
  } catch (e) { return porDefecto; }
}
function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

/* Stock: aleatorio entre 20 y 30 la primera vez (también para productos nuevos) */
let stock = leer('stock', {});
productos.forEach(p => {
  if (typeof stock[p.id] !== 'number') stock[p.id] = Math.floor(Math.random() * 11) + 20; // 20..30
});
guardar('stock', stock);

let carrito = leer('carrito', {});   // { idProducto: cantidad }
let seleccion = {};                  // cantidad elegida en cada tarjeta
productos.forEach(p => seleccion[p.id] = 1);

/* ============ UTILIDADES ============ */
function porId(id) { return productos.find(p => p.id === Number(id)); }
function enCarrito(id) { return carrito[id] || 0; }
function disponible(id) { return stock[id] - enCarrito(id); }

function esc(t) {
  return String(t).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

function aviso(texto) {
  const t = document.getElementById('toast');
  t.textContent = texto;
  t.classList.add('visible');
  clearTimeout(aviso.timer);
  aviso.timer = setTimeout(() => t.classList.remove('visible'), 2500);
}

/* Imagen del producto; si el archivo no existe muestra "Sin imagen" */
function imgHTML(p) {
  return `<img src="${p.imagen}" alt="${esc(p.nombre)}"
    onerror="this.parentNode.classList.add('sin-imagen'); this.remove();">`;
}

/* ============ LOGIN ============ */
let modoRegistro = false;

function cambiarModoLogin() {
  modoRegistro = !modoRegistro;
  document.getElementById('loginError').textContent = '';
  document.getElementById('loginSub').textContent = modoRegistro ? 'Crea tu cuenta' : 'Inicia sesión para comprar';
  document.getElementById('loginBtn').textContent = modoRegistro ? 'Crear cuenta' : 'Ingresar';
  document.getElementById('loginCambiar').textContent = modoRegistro
    ? '¿Ya tienes cuenta? Inicia sesión'
    : '¿No tienes cuenta? Crear cuenta';
}

function enviarLogin(e) {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value.trim().toLowerCase();
  const clave = document.getElementById('clave').value;
  const error = document.getElementById('loginError');
  const usuarios = leer('usuarios', {});

  if (modoRegistro) {
    if (usuarios[usuario]) { error.textContent = 'Ese usuario ya existe.'; return; }
    usuarios[usuario] = clave;
    guardar('usuarios', usuarios);
  } else {
    if (!usuarios[usuario] || usuarios[usuario] !== clave) {
      error.textContent = 'Usuario o contraseña incorrectos.';
      return;
    }
  }
  error.textContent = '';
  guardar('sesion', usuario);
  entrar(usuario);
}

function entrar(usuario) {
  document.getElementById('login').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  document.getElementById('nombreUsuario').textContent = usuario;
  renderProductos();
  renderCarrito();
}

function cerrarSesion() {
  localStorage.removeItem('sesion');
  document.getElementById('overlay').classList.remove('active');
  document.getElementById('app').style.display = 'none';
  document.getElementById('login').style.display = 'flex';
  document.getElementById('clave').value = '';
}

/* ============ PRODUCTOS ============ */
function renderProductos() {
  document.getElementById('grid').innerHTML = productos.map(p => {
    const disp = disponible(p.id);
    const agotado = disp <= 0;
    return `
    <div class="card">
      <div class="imagen">${imgHTML(p)}</div>
      <h3>${esc(p.nombre)}</h3>
      <div class="precio">S/ ${p.precio.toFixed(2)}</div>
      <div class="stock ${disp <= 5 ? 'poco' : ''}">${agotado ? 'Agotado' : 'Stock: ' + disp}</div>
      <div class="cantidad">
        <button onclick="cambiarSeleccion(${p.id}, -1)" ${agotado ? 'disabled' : ''}>−</button>
        <span>${agotado ? 0 : Math.min(seleccion[p.id], disp)}</span>
        <button onclick="cambiarSeleccion(${p.id}, 1)" ${agotado ? 'disabled' : ''}>+</button>
      </div>
      <button class="btn-agregar" onclick="agregar(${p.id})" ${agotado ? 'disabled' : ''}>Agregar</button>
    </div>`;
  }).join('');
}

function cambiarSeleccion(id, delta) {
  const max = disponible(id);
  let n = Math.min(seleccion[id], max) + delta;
  if (n < 1) n = 1;
  if (n > max) { n = max; aviso('No hay más stock disponible'); }
  seleccion[id] = n;
  renderProductos();
}

function agregar(id) {
  const disp = disponible(id);
  if (disp <= 0) { aviso('Producto agotado'); return; }
  const cant = Math.min(seleccion[id], disp);
  carrito[id] = enCarrito(id) + cant;
  seleccion[id] = 1;
  guardar('carrito', carrito);
  aviso(cant + ' × ' + porId(id).nombre + ' agregado');
  renderProductos();
  renderCarrito();
}

/* ============ CARRITO ============ */
function toggleCarrito() {
  document.getElementById('overlay').classList.toggle('active');
}

function cerrar(e) {
  if (e.target === document.getElementById('overlay')) toggleCarrito();
}

function cambiarCantidadCarrito(id, delta) {
  const nueva = enCarrito(id) + delta;
  if (nueva > stock[id]) { aviso('No hay más stock disponible'); return; }
  if (nueva <= 0) { quitar(id); return; }
  carrito[id] = nueva;
  guardar('carrito', carrito);
  renderProductos();
  renderCarrito();
}

function quitar(id) {
  delete carrito[id];
  guardar('carrito', carrito);
  renderProductos();
  renderCarrito();
}

function totalCarrito() {
  return Object.keys(carrito).reduce((s, id) => s + porId(id).precio * carrito[id], 0);
}

function renderCarrito() {
  const ids = Object.keys(carrito);
  const lista = document.getElementById('lista');

  lista.innerHTML = ids.length === 0
    ? '<p class="vacio">Tu carrito está vacío</p>'
    : ids.map(id => {
        const p = porId(id);
        const c = carrito[id];
        return `
        <div class="item">
          <div class="mini-img">${imgHTML(p)}</div>
          <div class="item-info">
            <div>${esc(p.nombre)}</div>
            <small>S/ ${p.precio.toFixed(2)} c/u</small>
          </div>
          <div class="item-der">
            <div class="mini-cant">
              <button onclick="cambiarCantidadCarrito(${p.id}, -1)">−</button>
              <span>${c}</span>
              <button onclick="cambiarCantidadCarrito(${p.id}, 1)">+</button>
            </div>
            <div class="sub">S/ ${(p.precio * c).toFixed(2)}</div>
          </div>
          <button class="quitar" onclick="quitar(${p.id})" title="Quitar">×</button>
        </div>`;
      }).join('');

  document.getElementById('contador').textContent =
    ids.reduce((s, id) => s + carrito[id], 0);
  document.getElementById('total').textContent = totalCarrito().toFixed(2);
}

/* ============ PEDIDO ============ */
function pagar() {
  if (Object.keys(carrito).length === 0) { aviso('Tu carrito está vacío'); return; }
  document.getElementById('totalModal').textContent = totalCarrito().toFixed(2);
  document.getElementById('pedidoError').textContent = '';
  document.getElementById('modal').classList.add('active');
}

function cerrarModal(e) {
  if (!e || e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('active');
  }
}

// Formato automático: solo números en DNI/teléfono y espacios cada 4 en tarjeta
document.getElementById('dni').addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '');
});
document.getElementById('telefono').addEventListener('input', e => {
  e.target.value = e.target.value.replace(/\D/g, '');
});
document.getElementById('tarjeta').addEventListener('input', e => {
  const n = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = n.replace(/(.{4})/g, '$1 ').trim();
});

function confirmarPedido(e) {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const dni = document.getElementById('dni').value.trim();
  const tarjeta = document.getElementById('tarjeta').value.replace(/\s/g, '');
  const telefono = document.getElementById('telefono').value.trim();
  const error = document.getElementById('pedidoError');

  if (nombre.length < 2) return error.textContent = 'Ingresa tu nombre.';
  if (apellido.length < 2) return error.textContent = 'Ingresa tu apellido.';
  if (!/^\d{8}$/.test(dni)) return error.textContent = 'El DNI debe tener 8 dígitos.';
  if (!/^\d{16}$/.test(tarjeta)) return error.textContent = 'La tarjeta debe tener 16 dígitos.';
  if (!/^9\d{8}$/.test(telefono)) return error.textContent = 'El teléfono debe tener 9 dígitos y empezar con 9.';

  // Guardar copia de los productos para el boleto
  const items = Object.keys(carrito).map(id => {
    const p = porId(id);
    return { nombre: p.nombre, precio: p.precio, cant: carrito[id] };
  });
  const total = totalCarrito();

  // Número de pedido correlativo
  const numero = leer('pedidos', 0) + 1;
  guardar('pedidos', numero);

  // Descontar stock y vaciar carrito
  Object.keys(carrito).forEach(id => { stock[id] -= carrito[id]; });
  guardar('stock', stock);
  carrito = {};
  guardar('carrito', carrito);

  document.getElementById('modal').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
  e.target.reset();
  renderProductos();
  renderCarrito();

  mostrarBoleto({
    numero, items, total,
    nombre, apellido, dni, telefono,
    tarjeta: '**** **** **** ' + tarjeta.slice(-4),
    usuario: leer('sesion', ''),
    fecha: new Date().toLocaleString('es-PE')
  });
}

/* ============ BOLETO ============ */
function mostrarBoleto(b) {
  const filas = b.items.map(i => `
    <tr>
      <td>${esc(i.nombre)}</td>
      <td class="c">${i.cant}</td>
      <td class="r">${i.precio.toFixed(2)}</td>
      <td class="r">${(i.precio * i.cant).toFixed(2)}</td>
    </tr>`).join('');

  document.getElementById('boletoContenido').innerHTML = `
    <div class="b-titulo">TiendaExpress</div>
    <div class="b-sub">BOLETO DE VENTA</div>
    <div class="b-linea"></div>
    <div class="b-dato"><span>N° de pedido</span><b>${String(b.numero).padStart(6, '0')}</b></div>
    <div class="b-dato"><span>Fecha</span><b>${esc(b.fecha)}</b></div>
    <div class="b-linea"></div>
    <div class="b-dato"><span>Cliente</span><b>${esc(b.nombre)} ${esc(b.apellido)}</b></div>
    <div class="b-dato"><span>DNI</span><b>${esc(b.dni)}</b></div>
    <div class="b-dato"><span>Teléfono</span><b>${esc(b.telefono)}</b></div>
    <div class="b-dato"><span>Tarjeta</span><b>${esc(b.tarjeta)}</b></div>
    <div class="b-linea"></div>
    <table class="b-tabla">
      <thead><tr><th>Producto</th><th class="c">Cant.</th><th class="r">P.Unit</th><th class="r">Importe</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>
    <div class="b-linea"></div>
    <div class="b-total"><span>TOTAL</span><span>S/ ${b.total.toFixed(2)}</span></div>
    <div class="b-linea"></div>
    <div class="b-gracias">¡Gracias por tu compra!</div>`;

  document.getElementById('boleto').classList.add('active');
}

function imprimirBoleto() {
  window.print();
}

function cerrarBoleto(e) {
  if (!e || e.target === document.getElementById('boleto')) {
    document.getElementById('boleto').classList.remove('active');
  }
}

/* ============ INICIO ============ */
const sesion = leer('sesion', null);
if (sesion) entrar(sesion);