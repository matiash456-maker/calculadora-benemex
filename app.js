let modoActual = 'm2';

// Catálogo base con los dos nuevos Wall Panels agregados
const productosIniciales = [
  { id: 1, nombre: "Wall panel chico (15cm x 2.90m)", m2: 0.435 },
  { id: 2, nombre: "Wall panel grande (30cm x 2.90m)", m2: 0.87 },
  { id: 3, nombre: "Rollito para vidrio (3m x 60cm)", m2: 1.8 },
  { id: 4, nombre: "Rollo para muebles (3m x 60cm)", m2: 1.8 },
  { id: 5, nombre: "Rollo para mueble (5m x 45cm)", m2: 2.25 },
  { id: 6, nombre: "Rollo símil wall panel (3m x 60cm)", m2: 1.8 },
  { id: 7, nombre: "Rollo grande (3m x 1.20m)", m2: 3.6 },
  { id: 8, nombre: "Placa pequeña (60cm x 30cm)", m2: 0.18 },
  { id: 9, nombre: "Placa grande (60cm x 60cm)", m2: 0.36 },
  { id: 10, nombre: "Placa ladrillo (70cm x 77cm)", m2: 0.539 },
  { id: 11, nombre: "Placa rosa con flores (65cm x 65cm)", m2: 0.4225 },
  { id: 12, nombre: "Césped (2m x 1m)", m2: 2.0 },
  { id: 13, nombre: "Césped otro (2m x 2m)", m2: 4.0 }
];

let productos = [];

function cargarProductos() {
  const guardados = localStorage.getItem('productosCalculadora');
  if (guardados) {
    productos = JSON.parse(guardados);
  } else {
    productos = [...productosIniciales];
    guardarEnLocalStorage();
  }
  renderizarSelect();
  renderizarListaAdmin();
}

function guardarEnLocalStorage() {
  localStorage.setItem('productosCalculadora', JSON.stringify(productos));
}

function renderizarSelect() {
  const select = document.getElementById('producto');
  select.innerHTML = '';
  productos.forEach(prod => {
    const opt = document.createElement('option');
    opt.value = prod.m2;
    opt.textContent = `${prod.nombre} (${prod.m2.toFixed(3)} m²)`;
    select.appendChild(opt);
  });
}

function renderizarListaAdmin() {
  const lista = document.getElementById('listaProductos');
  lista.innerHTML = '';
  productos.forEach(prod => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${prod.nombre} - <b>${prod.m2.toFixed(3)} m²</b></span>
      <button class="btn-eliminar" onclick="eliminarProducto(${prod.id})">x</button>
    `;
    lista.appendChild(li);
  });
}

function agregarProducto() {
  const nombre = document.getElementById('nuevoNombre').value.trim();
  let ancho = parseFloat(document.getElementById('nuevoAncho').value) || 0;
  let largo = parseFloat(document.getElementById('nuevoLargo').value) || 0;

  if (!nombre || ancho <= 0 || largo <= 0) {
    alert('Ingresá un nombre y medidas válidas mayores a 0.');
    return;
  }

  // Convertir cm a metros si se ingresa en centímetros (ej: 15 -> 0.15)
  if (ancho > 10) ancho = ancho / 100;
  if (largo > 100) largo = largo / 100;

  const m2 = ancho * largo;
  const nuevoProd = {
    id: Date.now(),
    nombre: `${nombre} (${ancho * 100 < 100 ? (ancho * 100) + 'cm' : ancho + 'm'} x ${largo}m)`,
    m2: m2
  };

  productos.push(nuevoProd);
  guardarEnLocalStorage();
  renderizarSelect();
  renderizarListaAdmin();

  // Limpiar campos
  document.getElementById('nuevoNombre').value = '';
  document.getElementById('nuevoAncho').value = '';
  document.getElementById('nuevoLargo').value = '';
}

function eliminarProducto(id) {
  if (confirm('¿Deseás eliminar este producto?')) {
    productos = productos.filter(p => p.id !== id);
    guardarEnLocalStorage();
    renderizarSelect();
    renderizarListaAdmin();
  }
}

function cambiarModo(modo) {
  modoActual = modo;
  const secM2 = document.getElementById('secM2');
  const secMedidas = document.getElementById('secMedidas');
  const btnM2 = document.getElementById('btnM2');
  const btnMedidas = document.getElementById('btnMedidas');

  if (modo === 'm2') {
    secM2.classList.remove('hidden');
    secMedidas.classList.add('hidden');
    btnM2.classList.add('active');
    btnMedidas.classList.remove('active');
  } else {
    secM2.classList.add('hidden');
    secMedidas.classList.remove('hidden');
    btnM2.classList.remove('active');
    btnMedidas.classList.add('active');
  }
}

function calcular() {
  const superficieProd = parseFloat(document.getElementById('producto').value);
  const desperdicioPct = parseFloat(document.getElementById('desperdicioInput').value) || 0;
  let m2Nominales = 0;

  if (modoActual === 'm2') {
    m2Nominales = parseFloat(document.getElementById('m2Input').value) || 0;
  } else {
    const ancho = parseFloat(document.getElementById('anchoInput').value) || 0;
    const alto = parseFloat(document.getElementById('altoInput').value) || 0;
    m2Nominales = ancho * alto;
  }

  if (m2Nominales <= 0) {
    alert('Por favor, ingresá valores válidos mayores a 0.');
    return;
  }

  const factorDesperdicio = 1 + (desperdicioPct / 100);
  const m2TotalesConMargen = m2Nominales * factorDesperdicio;
  const unidadesNecesarias = Math.ceil(m2TotalesConMargen / superficieProd);

  document.getElementById('resM2Nominal').innerText = `Superficie base: ${m2Nominales.toFixed(2)} m²`;
  document.getElementById('resM2ConMargen').innerText = `Con ${desperdicioPct}% desperdicio: ${m2TotalesConMargen.toFixed(2)} m²`;
  document.getElementById('resUnidades').innerText = `Necesitás: ${unidadesNecesarias} unidad(es)`;

  document.getElementById('resultado').classList.remove('hidden');
}

// Inicializar al cargar la pantalla
cargarProductos();
