class Cliente {
    constructor(id, nombre, direccion) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
    }
}

class Producto {
    constructor(id, nombre, precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = parseFloat(precio);
    }
}

class Ruta {
    constructor(id, origen, destino) {
        this.id = id;
        this.origen = origen;
        this.destino = destino;
    }
}

class Repartidor {
    constructor(id, nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}

const MAX_RUTAS = 50;
const rutasEstaticas = new Array(MAX_RUTAS).fill(null);
let contadorRutas = 0;

let clientes = [];
let productos = [];
let repartidores = [];

let currentTab = 'clientes';

document.addEventListener('DOMContentLoaded', () => {
    updateFormInputs();
    renderList();
    updateStats();

    document.getElementById('entityType').addEventListener('change', (e) => {
        switchTab(e.target.value + 's');
        updateFormInputs();
    });
});

function buscarRecursivo(array, id, index = 0) {
    if (index >= array.length) return -1;
    if (array[index] && array[index].id == id) return index;
    return buscarRecursivo(array, id, index + 1);
}

function renderListRecursivo(array, container, index = 0) {
    if (index >= array.length) return;

    const item = array[index];
    if (item) {
        const div = document.createElement('div');
        div.className = 'list-item';

        let details = '';
        if (item instanceof Cliente) details = `<p>Dirección: ${item.direccion}</p>`;
        else if (item instanceof Producto) details = `<p>Precio: $${item.precio.toFixed(2)}</p>`;
        else if (item instanceof Ruta) details = `<p>${item.origen} ➝ ${item.destino}</p>`;
        else if (item instanceof Repartidor) details = `<p>Repartidor</p>`;

        div.innerHTML = `
            <div class="item-details">
                <h3>${item.nombre || 'Ruta ' + item.id} <span class="item-id">#${item.id}</span></h3>
                ${details}
            </div>
        `;
        container.appendChild(div);
    }

    renderListRecursivo(array, container, index + 1);
}

function handleAdd() {
    const type = document.getElementById('entityType').value;
    const id = document.getElementById('inputId').value;

    if (!id) return alert('ID es requerido');

    if (type === 'ruta') {
        if (buscarRecursivo(rutasEstaticas.slice(0, contadorRutas), id) !== -1) return alert('ID ya existe');
    } else {
        const collection = getCollection(type);
        if (buscarRecursivo(collection, id) !== -1) return alert('ID ya existe');
    }

    if (type === 'cliente') {
        const nombre = document.getElementById('inputNombre').value;
        const direccion = document.getElementById('inputDireccion').value;
        clientes.push(new Cliente(id, nombre, direccion));
    } else if (type === 'producto') {
        const nombre = document.getElementById('inputNombre').value;
        const precio = document.getElementById('inputPrecio').value;
        productos.push(new Producto(id, nombre, precio));
    } else if (type === 'ruta') {
        if (contadorRutas >= MAX_RUTAS) return alert('Memoria estática llena (Máx 50 rutas)');
        const origen = document.getElementById('inputOrigen').value;
        const destino = document.getElementById('inputDestino').value;
        rutasEstaticas[contadorRutas++] = new Ruta(id, origen, destino);
    } else if (type === 'repartidor') {
        const nombre = document.getElementById('inputNombre').value;
        repartidores.push(new Repartidor(id, nombre));
    }

    clearInputs();
    renderList();
    updateStats();
}

function handleDelete() {
    const type = document.getElementById('entityType').value;
    const id = document.getElementById('inputId').value;

    if (!id) return alert('Ingrese ID para eliminar');

    if (type === 'ruta') {
        const index = buscarRecursivo(rutasEstaticas.slice(0, contadorRutas), id);
        if (index !== -1) {
            for (let i = index; i < contadorRutas - 1; i++) {
                rutasEstaticas[i] = rutasEstaticas[i + 1];
            }
            rutasEstaticas[contadorRutas - 1] = null;
            contadorRutas--;
        } else {
            return alert('No encontrado');
        }
    } else {
        const collection = getCollection(type);
        const index = buscarRecursivo(collection, id);
        if (index !== -1) {
            collection.splice(index, 1);
        } else {
            return alert('No encontrado');
        }
    }

    renderList();
    updateStats();
}

function handleModify() {
    const type = document.getElementById('entityType').value;
    const id = document.getElementById('inputId').value;

    if (!id) return alert('Ingrese ID para modificar');

    let item;
    if (type === 'ruta') {
        const index = buscarRecursivo(rutasEstaticas.slice(0, contadorRutas), id);
        if (index !== -1) item = rutasEstaticas[index];
    } else {
        const collection = getCollection(type);
        const index = buscarRecursivo(collection, id);
        if (index !== -1) item = collection[index];
    }

    if (!item) return alert('No encontrado');

    if (type === 'cliente') {
        const nombre = document.getElementById('inputNombre').value;
        const direccion = document.getElementById('inputDireccion').value;
        if (nombre) item.nombre = nombre;
        if (direccion) item.direccion = direccion;
    } else if (type === 'producto') {
        const nombre = document.getElementById('inputNombre').value;
        const precio = document.getElementById('inputPrecio').value;
        if (nombre) item.nombre = nombre;
        if (precio) item.precio = parseFloat(precio);
    } else if (type === 'ruta') {
        const origen = document.getElementById('inputOrigen').value;
        const destino = document.getElementById('inputDestino').value;
        if (origen) item.origen = origen;
        if (destino) item.destino = destino;
    } else if (type === 'repartidor') {
        const nombre = document.getElementById('inputNombre').value;
        if (nombre) item.nombre = nombre;
    }

    renderList();
}

function handleCompare() {
    if (productos.length < 2) return alert('Se necesitan al menos 2 productos para comparar');

    const p1 = productos[0];
    const p2 = productos[1];

    let msg = `Comparando ${p1.nombre} ($${p1.precio}) vs ${p2.nombre} ($${p2.precio}):\n`;
    if (p1.precio > p2.precio) msg += `${p1.nombre} es más caro.`;
    else if (p1.precio < p2.precio) msg += `${p2.nombre} es más caro.`;
    else msg += `Tienen el mismo precio.`;

    alert(msg);
}

function switchTab(tabName) {
    currentTab = tabName;

    const map = { 'clientes': 'cliente', 'productos': 'producto', 'rutas': 'ruta', 'repartidores': 'repartidor' };
    const select = document.getElementById('entityType');
    if (map[tabName]) select.value = map[tabName];

    document.querySelectorAll('.tabs button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes(tabName.substring(0, 4))) {
            btn.classList.add('active');
        }
    });

    updateFormInputs();
    renderList();

    const btnCompare = document.getElementById('btnCompare');
    btnCompare.style.display = tabName === 'productos' ? 'block' : 'none';
}

function getCollection(type) {
    if (type === 'cliente') return clientes;
    if (type === 'producto') return productos;
    if (type === 'repartidor') return repartidores;
    return [];
}

function updateFormInputs() {
    const type = document.getElementById('entityType').value;
    const container = document.getElementById('formInputs');
    container.innerHTML = `<input type="number" id="inputId" placeholder="ID (Numérico)" required>`;

    if (type === 'cliente') {
        container.innerHTML += `
            <input type="text" id="inputNombre" placeholder="Nombre Cliente">
            <input type="text" id="inputDireccion" placeholder="Dirección">
        `;
    } else if (type === 'producto') {
        container.innerHTML += `
            <input type="text" id="inputNombre" placeholder="Nombre Producto">
            <input type="number" id="inputPrecio" placeholder="Precio" step="0.01">
        `;
    } else if (type === 'ruta') {
        container.innerHTML += `
            <input type="text" id="inputOrigen" placeholder="Origen">
            <input type="text" id="inputDestino" placeholder="Destino">
        `;
    } else if (type === 'repartidor') {
        container.innerHTML += `
            <input type="text" id="inputNombre" placeholder="Nombre Repartidor">
        `;
    }
}

function renderList() {
    const container = document.getElementById('listContainer');
    container.innerHTML = '';

    let data = [];
    if (currentTab === 'clientes') data = clientes;
    else if (currentTab === 'productos') data = productos;
    else if (currentTab === 'rutas') data = rutasEstaticas.slice(0, contadorRutas);
    else if (currentTab === 'repartidores') data = repartidores;

    renderListRecursivo(data, container);

    if (data.length === 0) {
        container.innerHTML = '<div style="text-align:center; color: var(--text-muted); padding: 2rem;">No hay datos registrados</div>';
    }
}

function updateStats() {
    const staticPercent = (contadorRutas / MAX_RUTAS) * 100;
    document.getElementById('staticMemoryBar').style.width = `${staticPercent}%`;
    document.getElementById('staticMemoryText').innerText = `${contadorRutas} / ${MAX_RUTAS}`;

    const totalDynamic = clientes.length + productos.length + repartidores.length;
    document.getElementById('dynamicMemoryCount').innerText = `${totalDynamic} elementos`;
}

function clearInputs() {
    document.querySelectorAll('#formInputs input').forEach(input => input.value = '');
}
