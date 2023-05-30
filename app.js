//seleccionamos los elementos donde vamos a pintar contenido de nuestro html
const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
//cuando accedemos a template, hay que colocar el .content al final para acceder a su contenido
const templateCard = document.getElementById('template-card').content;
const templateCarrito = document.getElementById('template-carrito').content;
const templateFooter = document.getElementById('template-footer').content;
const fragment = document.createDocumentFragment();
// carrito vacio donde se van a cargar los productos
let carrito = {};

document.addEventListener('DOMContentLoaded', () => {
	capturandoData();

	//preguntamos si hay un carrito lleno en localStorage, de ser true, pintamos el carrito
	if (localStorage.getItem('carrito')) {
		carrito = JSON.parse(localStorage.getItem('carrito'));
		pintarCarrito();
	}
});

cards.addEventListener('click', (evento) => {
	agregarCarrito(evento);
});

items.addEventListener('click', (evento) => {
	btnAccion(evento);
});

//utilizamos fetch para comumir los datos de la api, en este caso la api es una simulacion local de una api
const capturandoData = async () => {
	try {
		const respuesta = await fetch('https://fakestoreapi.com/products/category/electronics');
		const data = await respuesta.json();
		// console.log(data);
		pintarProductos(data);
	} catch (error) {
		console.log(error);
	}
};

const pintarProductos = (data) => {
	// recorremos el array de productos
	data.forEach((producto) => {
		// seleccionamos el titulo y le insertamos el titulo
		templateCard.querySelector('h5').textContent = producto.title;
		//seleccionamos el parrafo y le insertamos el precio
		templateCard.querySelector('p').textContent = producto.price;
		//seleccionamos la imagen y le seteamos la imagen
		templateCard.querySelector('img').setAttribute('src', producto.image);
		// seleccionamos el boton y le asignamos el id de ese producto
		templateCard.querySelector('button').dataset.id = producto.id;
		const clone = templateCard.cloneNode(true);
		fragment.appendChild(clone);
	});
	cards.appendChild(fragment);
};

const agregarCarrito = (evento) => {
	if (evento.target.classList.contains('btn-dark')) {
		setcarrito(evento.target.parentElement);
	}
	evento.stopPropagation;
};

const setcarrito = (objeto) => {
	// console.log(objeto);
	const producto = {
		id: objeto.querySelector('.btn-dark').dataset.id,
		title: objeto.querySelector('h5').textContent,
		precio: objeto.querySelector('p').textContent,
		cantidad: 1,
	};
	if (carrito.hasOwnProperty(producto.id)) {
		producto.cantidad = carrito[producto.id].cantidad + 1;
	}
	carrito[producto.id] = { ...producto };
	pintarCarrito();
};

const pintarCarrito = () => {
	items.innerHTML = '';
	//el object.values permite utilizar las funcionalidades de los arrays en objetos
	Object.values(carrito).forEach((producto) => {
		templateCarrito.querySelector('th').textContent = producto.id;
		templateCarrito.querySelectorAll('td')[0].textContent = producto.title;
		templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad;
		templateCarrito.querySelector('.btn-info').dataset.id = producto.id;
		templateCarrito.querySelector('.btn-danger').dataset.id = producto.id;
		templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio;
		const clone = templateCarrito.cloneNode(true);
		fragment.appendChild(clone);
	});
	items.appendChild(fragment);

	pintarFooter();
	//guardamos el carrito en localstorage
	localStorage.setItem('carrito', JSON.stringify(carrito));
};
const pintarFooter = () => {
	footer.innerHTML = '';
	//el object.values permite utilizar las funcionalidades de los arrays en objetos
	if (Object.values(carrito).length === 0) {
		footer.innerHTML = `<th scope="row" colspan="5">El carrito esta vacio</th>`;
		//el return hace que salga de la funcion
		return;
	}
	//el object.values permite utilizar las funcionalidades de los arrays en objetos
	const nCantidad = Object.values(carrito).reduce(
		(acumulador, { cantidad }) => acumulador + cantidad,
		0
	);
	const nPrecio = Object.values(carrito).reduce(
		(acumulador, { cantidad, precio }) => acumulador + cantidad * precio,
		0
	);

	templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
	templateFooter.querySelector('span').textContent = nPrecio;
	const clone = templateFooter.cloneNode(true);
	fragment.appendChild(clone);
	footer.appendChild(fragment);
	console.log(nCantidad);
	console.log(nPrecio);
	const btnVaciarCarrito = document.getElementById('vaciar-carrito');
	btnVaciarCarrito.addEventListener('click', () => {
		carrito = {};
		pintarCarrito();
	});
};

const btnAccion = (evento) => {
	if (evento.target.classList.contains('btn-info')) {
		const producto = carrito[evento.target.dataset.id];
		producto.cantidad++;
		// carrito[evento.target.dataset.id] = { ...producto };
		pintarCarrito();
	}

	if (evento.target.classList.contains('btn-danger')) {
		const producto = carrito[evento.target.dataset.id];
		producto.cantidad--;
		if (producto.cantidad === 0) {
			delete carrito[evento.target.dataset.id];
		}
		pintarCarrito();
	}
	console.log(carrito);
	evento.stopPropagation();
};
