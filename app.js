let modoActual = 'm2';

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

  // Cálculo del área total requerida con desperdicio
  const factorDesperdicio = 1 + (desperdicioPct / 100);
  const m2TotalesConMargen = m2Nominales * factorDesperdicio;

  // Cantidad de unidades redondeada hacia arriba
  const unidadesNecesarias = Math.ceil(m2TotalesConMargen / superficieProd);

  // Mostrar resultados
  document.getElementById('resM2Nominal').innerText = `Superficie base: ${m2Nominales.toFixed(2)} m²`;
  document.getElementById('resM2ConMargen').innerText = `Con ${desperdicioPct}% desperdicio: ${m2TotalesConMargen.toFixed(2)} m²`;
  document.getElementById('resUnidades').innerText = `Necesitás: ${unidadesNecesarias} unidad(es)`;

  document.getElementById('resultado').classList.remove('hidden');
}
