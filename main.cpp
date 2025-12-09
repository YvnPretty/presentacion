#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

// Estructuras de datos
struct Cliente {
    int id;
    string nombre;
    string direccion;
};

struct Producto {
    int id;
    string nombre;
    float precio;
};

struct Ruta {
    int id;
    string origen;
    string destino;
};

struct Repartidor {
    int id;
    string nombre;
};

// Memoria estática (Array fijo)
const int MAX_RUTAS = 50;
Ruta rutasEstaticas[MAX_RUTAS];
int contadorRutas = 0;

// Memoria dinámica (Vectores)
vector<Cliente> clientes;
vector<Producto> productos;
vector<Repartidor> repartidores;

// Funciones Recursivas
void mostrarClientesRecursivo(int index) {
    if (index >= clientes.size()) return;
    cout << "ID: " << clientes[index].id << ", Nombre: " << clientes[index].nombre << ", Direccion: " << clientes[index].direccion << endl;
    mostrarClientesRecursivo(index + 1);
}

int buscarProductoRecursivo(int index, int idBusqueda) {
    if (index >= productos.size()) return -1;
    if (productos[index].id == idBusqueda) return index;
    return buscarProductoRecursivo(index + 1, idBusqueda);
}

// Operaciones
void crearCliente() {
    Cliente c;
    cout << "ID Cliente: "; cin >> c.id;
    cout << "Nombre: "; cin.ignore(); getline(cin, c.nombre);
    cout << "Direccion: "; getline(cin, c.direccion);
    clientes.push_back(c);
}

void crearProducto() {
    Producto p;
    cout << "ID Producto: "; cin >> p.id;
    cout << "Nombre: "; cin.ignore(); getline(cin, p.nombre);
    cout << "Precio: "; cin >> p.precio;
    productos.push_back(p);
}

void crearRuta() {
    if (contadorRutas >= MAX_RUTAS) {
        cout << "Memoria estatica llena para rutas." << endl;
        return;
    }
    Ruta r;
    cout << "ID Ruta: "; cin >> r.id;
    cout << "Origen: "; cin.ignore(); getline(cin, r.origen);
    cout << "Destino: "; getline(cin, r.destino);
    rutasEstaticas[contadorRutas++] = r;
}

void crearRepartidor() {
    Repartidor r;
    cout << "ID Repartidor: "; cin >> r.id;
    cout << "Nombre: "; cin.ignore(); getline(cin, r.nombre);
    repartidores.push_back(r);
}

void eliminarCliente() {
    int id;
    cout << "ID Cliente a eliminar: "; cin >> id;
    for (auto it = clientes.begin(); it != clientes.end(); ++it) {
        if (it->id == id) {
            clientes.erase(it);
            cout << "Cliente eliminado." << endl;
            return;
        }
    }
    cout << "Cliente no encontrado." << endl;
}

void modificarProducto() {
    int id;
    cout << "ID Producto a modificar: "; cin >> id;
    int index = buscarProductoRecursivo(0, id);
    if (index != -1) {
        cout << "Nuevo Nombre: "; cin.ignore(); getline(cin, productos[index].nombre);
        cout << "Nuevo Precio: "; cin >> productos[index].precio;
    } else {
        cout << "Producto no encontrado." << endl;
    }
}

void mostrarTodo() {
    cout << "--- Clientes ---" << endl;
    mostrarClientesRecursivo(0);
    cout << "--- Productos ---" << endl;
    for (const auto& p : productos) {
        cout << "ID: " << p.id << ", Nombre: " << p.nombre << ", Precio: " << p.precio << endl;
    }
    cout << "--- Rutas ---" << endl;
    for (int i = 0; i < contadorRutas; ++i) {
        cout << "ID: " << rutasEstaticas[i].id << ", Origen: " << rutasEstaticas[i].origen << ", Destino: " << rutasEstaticas[i].destino << endl;
    }
    cout << "--- Repartidores ---" << endl;
    for (const auto& r : repartidores) {
        cout << "ID: " << r.id << ", Nombre: " << r.nombre << endl;
    }
}

void compararProductos() {
    if (productos.size() < 2) {
        cout << "No hay suficientes productos para comparar." << endl;
        return;
    }
    if (productos[0].precio > productos[1].precio) {
        cout << productos[0].nombre << " es mas caro que " << productos[1].nombre << endl;
    } else {
        cout << productos[1].nombre << " es mas caro o igual que " << productos[0].nombre << endl;
    }
}

void menu() {
    int opcion;
    do {
        cout << "\n--- Sistema de Gestion de Correos ---" << endl;
        cout << "1. Crear Cliente" << endl;
        cout << "2. Crear Producto" << endl;
        cout << "3. Crear Ruta" << endl;
        cout << "4. Crear Repartidor" << endl;
        cout << "5. Eliminar Cliente" << endl;
        cout << "6. Modificar Producto" << endl;
        cout << "7. Mostrar Todo" << endl;
        cout << "8. Comparar (Primeros 2 productos)" << endl;
        cout << "0. Salir" << endl;
        cout << "Opcion: ";
        cin >> opcion;

        switch (opcion) {
            case 1: crearCliente(); break;
            case 2: crearProducto(); break;
            case 3: crearRuta(); break;
            case 4: crearRepartidor(); break;
            case 5: eliminarCliente(); break;
            case 6: modificarProducto(); break;
            case 7: mostrarTodo(); break;
            case 8: compararProductos(); break;
            case 0: cout << "Saliendo..." << endl; break;
            default: cout << "Opcion invalida." << endl;
        }
    } while (opcion != 0);
}

int main() {
    menu();
    return 0;
}
