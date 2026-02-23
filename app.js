let movimientos = [];
let productos = [];

function agregarProducto() {
    let talla = document.getElementById("talla").value;
    let diseno = document.getElementById("diseno").value;
    let cantidad = document.getElementById("cantidad").value;

    if(talla === "" || diseno === "" || cantidad === "") {
        alert("Completa todos los campos");
        return;
    }

    let producto = {
        talla: talla,
        diseno: diseno,
        cantidad: Number(cantidad)
    };

    productos.push(producto);

    guardarDatos();
    mostrarProductos();
}

function mostrarProductos(listaProductos = productos) {
    let lista = document.getElementById("listaProductos");
    lista.innerHTML = "";

    listaProductos.forEach((p, index) => {
        let alerta = p.cantidad <= 5 ? "⚠️ Bajo stock" : "";

        lista.innerHTML += `
            <div class="producto">
                <strong>Diseño:</strong> ${p.diseno}<br>
                <strong>Talla:</strong> ${p.talla}<br>
                <strong>Cantidad:</strong> ${p.cantidad} ${alerta}<br><br>

                <button onclick="sumarUno(${index})">➕</button>
                <button onclick="restarUno(${index})">➖</button>
                <button onclick="eliminarProducto(${index})">🗑️</button>
            </div>
        `;
    });

    actualizarDashboard();
    actualizarGrafica();
}

function eliminarProducto(index) {
    productos.splice(index, 1);
    mostrarProductos();
	guardarDatos();
actualizarDashboard();
guardarDatos();
}
function iniciarSesion() {
    let usuario = document.getElementById("usuario").value;
    let password = document.getElementById("password").value;

    if(usuario === "lapark" && password === "141165") {
        document.getElementById("login").style.display = "none";
        document.getElementById("app").style.display = "block";
    } else {
        alert("Credenciales incorrectas");
    }
}
function buscarProducto() {
    let filtro = document.getElementById("buscador").value.toLowerCase();

    let productosFiltrados = productos.filter(p =>
        p.diseno.toLowerCase().includes(filtro) ||
        p.talla.toLowerCase().includes(filtro)
    );

    mostrarProductos(productosFiltrados);
}
function mostrarProductos(listaProductos = productos) {
    let lista = document.getElementById("listaProductos");
    lista.innerHTML = "";

    listaProductos.forEach((p, index) => {
        let alerta = p.cantidad <= 5 ? "⚠️ Bajo stock" : "";

        lista.innerHTML += `
            <div class="producto">
                <strong>Diseño:</strong> ${p.diseno}<br>
                <strong>Talla:</strong> ${p.talla}<br>
                <strong>Cantidad:</strong> ${p.cantidad} ${alerta}<br><br>

                <button onclick="sumarUno(${index})">➕</button>
                <button onclick="restarUno(${index})">➖</button>
                <button onclick="eliminarProducto(${index})">🗑️</button>
            </div>
        `;
    });

    actualizarDashboard();
    actualizarGrafica();
}
function actualizarDashboard() {
    document.getElementById("totalProductos").innerText = productos.length;

    let stockTotal = productos.reduce((acc, p) => acc + p.cantidad, 0);
    document.getElementById("stockTotal").innerText = stockTotal;
}
function sumarUno(index) {
    productos[index].cantidad++;

    movimientos.push({
        producto: productos[index].nombre,
        tipo: "Entrada",
        fecha: new Date().toLocaleString()
    });

    guardarDatos();
    mostrarProductos();
    mostrarMovimientos();
}

function restarUno(index) {
    if(productos[index].cantidad > 0) {
        productos[index].cantidad--;

        movimientos.push({
            producto: productos[index].nombre,
            tipo: "Salida",
            fecha: new Date().toLocaleString()
        });

        guardarDatos();
        mostrarProductos();
        mostrarMovimientos();
    }
}
function mostrarMovimientos() {
    let historial = document.getElementById("historial");
    historial.innerHTML = "";

    movimientos.slice().reverse().forEach(m => {
        historial.innerHTML += `
            <div class="producto">
                ${m.tipo} - ${m.producto}<br>
                ${m.fecha}
            </div>
        `;
    });
}
let grafica;

function actualizarGrafica() {
    let etiquetas = productos.map(p => p.diseno + " - " + p.talla);
    let cantidades = productos.map(p => p.cantidad);

    if(grafica) {
        grafica.destroy();
    }

    let ctx = document.getElementById('graficaInventario').getContext('2d');

    grafica = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Cantidad',
                data: cantidades
            }]
        }
    });
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
function buscarPorCodigo(codigoEscaneado) {
    let producto = productos.find(p => p.codigo === codigoEscaneado);
    if(producto) {
        producto.cantidad++;
        guardarDatos();
        mostrarProductos();
    } else {
        alert("Producto no encontrado");
    }
}
function iniciarCamara() {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: 250
        },
        (codigo) => {
            document.getElementById("diseno").value = codigo;
            html5QrCode.stop();
            document.getElementById("reader").innerHTML = "";
        },
        (error) => {
            console.log("Escaneando...");
        }
    ).catch(err => {
        console.log("Error al iniciar cámara", err);
    });
}
function guardarDatos() {
    localStorage.setItem("inventario", JSON.stringify(productos));
}

function cargarDatos() {
    let datos = localStorage.getItem("inventario");
    if(datos) {
        productos = JSON.parse(datos);
        mostrarProductos();
        actualizarDashboard();
    }
}
window.onload = cargarDatos;

