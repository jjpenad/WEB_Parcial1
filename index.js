const urls = {
	productos:
		'https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json'
};

const carContainer = document.getElementById('carContainer');
const amountCarItems = document.getElementById('amountCarItems');
const categoryTitle = document.getElementById('categoryTitle');
const categNav = document.getElementById('categoriesNav');
const mainContainer = document.getElementById('categoryItems');
const rowForItems = document.getElementById('categoryItems').getElementsByClassName('row')[0];
const modalYesBtn = document.getElementById('modalYesBtn');
const modalNoBtn = document.getElementById('modalNoBtn');
const car = [];

function setCategories() {
	let listItems = categNav.getElementsByTagName('ul')[0].getElementsByTagName('li');
	let i;
	for (i = 0; i < listItems.length; i++) {
		let lis = listItems[i];
		let anchor = lis.getElementsByTagName('a')[0];
		anchor.addEventListener('click', changeProcuctsByCategory);
	}
}

function changeProcuctsByCategory(c) {
	let category = c.path[0].innerHTML;

	categoryTitle.innerHTML = category;

	fetch(urls['productos'])
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			json.forEach((element) => {
				if (element['name'] === category) {
					let prod = element['products'];
					let string = '';
					prod.forEach((elem) => {
						string += putAndGetInColumn(
							createItemCard(elem['image'], elem['name'], elem['description'], elem['price'])
						);
					});
					mainContainer.innerHTML = putAndGetInRow(string);
				}
			});
			setAddToCarEvents();
		});
}

function putAndGetInColumn(str) {
	return `<div class="col">${str}</div>`;
}

function putAndGetInRow(str) {
	return `<div class="row row-cols-1 row-cols-md-4 g-4">${str}</div>`;
}

function putAndGetInTableContainer(id, table, footer) {
	return `<div id="${id}" class="container-fluid tableContainer">
				<div class="container-fluid tcTable">
					${table}
				</div>
				<div class="container-fluid d-flex justify-content-between tcFooter">
					${footer}
				</div>
			</div>`;
}

function getCarTable() {
	let string = '';
	let total = 0;
	let i;
	for (i = 0; i < car.length; i++) {
		let it = car[i];
		amount = Number(it.price) * Number(it.quantity);
		let tItem = `	<tr>
						<th scope="row">${i + 1}</th>
						<td class="tItemQ">${it.quantity}</td>
						<td class="tItemName">${it.name}</td>
						<td class="tItemPrice">${it.price}</td>
						<td class="tItemAmount">${amount.toFixed(2)}</td>
						<td>
							<button type="button" class="btn btn-dark more">+</button>
							<button type="button" class="btn btn-dark less">-</button>
						</td>
					</tr>`;

		total += amount;
		string += tItem;
	}

	let head = `<thead>
					<tr>
						<th scope="col">Item</th>
						<th scope="col">Qty.</th>
						<th scope="col">Description</th>
						<th scope="col">Unit Price</th>
						<th scope="col">Amount</th>
						<th scope="col">Modify</th>
					</tr>
				</thead>`;
	let body = `<tbody>${string}</tbody>`;

	let table = `<table class="table">${head}${body}</table>`;

	return [ total.toFixed(2), table ];
}

function createItemCard(src, title, content, price) {
	let card = `<div class="card h-100">
					<img src="${src}" class="card-img-top" alt="item">
					<div class="card-body text-start">
						<h2 class="card-title">${title}</h2>
						<p class="card-text">${content}</p>
					</div>
					<div class="card-footer text-start">
						<p ><strong>&#36;<span class="itemPrice">${price}</span></strong></p>
						<a class="btn btn-dark float-left addToCar">Add to car</a>
      				</div>
				</div>`;

	return card;
}

function setAddToCarEvents() {
	let row = mainContainer.getElementsByClassName('row');
	if (row) {
		let r = row[0];
		let collection = r.getElementsByClassName('addToCar');
		let i = 0;
		for (i = 0; i < collection.length; i++) {
			collection[i].addEventListener('click', addToCar);
		}
	}
}

function addToCar(event) {
	let card = event.path[2];
	let title = card.getElementsByClassName('card-title')[0].innerHTML;
	let content = card.getElementsByClassName('card-text')[0].innerHTML;
	let price = card.getElementsByClassName('itemPrice')[0].innerHTML;

	addToCarByItem({ name: title, content: content, price: price });
	showCarSize();
}

function addToCarByItem(item) {
	let found = false;
	let i;

	for (i = 0; i < car.length; i++) {
		let it = car[i];
		if (it.name === item.name) {
			found = it;
			break;
		}
	}

	if (found) {
		found.quantity++;
	}
	else {
		let newElem = { quantity: 1, name: item.name, content: item.content, price: item.price };
		car.push(newElem);
	}
}

function removeFromCarByItem(item) {
	let found = false;
	let i;

	for (i = 0; i < car.length; i++) {
		let it = car[i];
		if (it.name === item.name) {
			found = it;
			break;
		}
	}

	if (found) {
		if (found.quantity > 0) {
			found.quantity--;
			if (found.quantity === 0) {
				car.splice(i, 1);
			}
		}
	}
}

function showCarSize() {
	let q = 0;
	car.forEach((element) => {
		q += element.quantity;
	});
	amountCarItems.innerHTML = `${q} items`;
}

function showCarOnScreen() {
	let totalAndTable = getCarTable();

	let footer = `
		<div>
			<strong>
				Total: ${totalAndTable[0]}
			</strong>
		</div>
		<div>
			<button type="button" class="btn btn-danger cancelOrder" data-bs-toggle="modal" data-bs-target="#cancelModal">Cancel</button>
			<button type="button" class="btn btn-light confirmOrder">Confirm Order</button>
		</div>
	
	`;

	categoryTitle.innerHTML = `Order Detail`;
	mainContainer.innerHTML = putAndGetInTableContainer('tc1', totalAndTable[1], footer);

	setEventCarTable();
}

function setEventCarTable() {
	let tContainer = document.getElementById('tc1');
	if (tContainer) {
		let table = tContainer.getElementsByClassName('tcTable')[0].getElementsByClassName('table')[0];
		let tableBody = table.getElementsByTagName('tbody')[0];
		let tRows = tableBody.getElementsByTagName('tr');
		let i;
		for (i = 0; i < tRows.length; i++) {
			let btnMore = tRows[i].getElementsByClassName('more')[0];
			let btnLess = tRows[i].getElementsByClassName('less')[0];

			btnMore.addEventListener('click', modifyItemAdd);
			btnLess.addEventListener('click', modifyItemRemove);
		}

		let footer = tContainer.getElementsByClassName('tcFooter')[0];
		//  let btnCancel = footer.getElementsByClassName('cancelOrder')[0];
		let btnConfirm = footer.getElementsByClassName('confirmOrder')[0];

		//	btnCancel.addEventListener('click',cancelOrder);
		btnConfirm.addEventListener('click', confirmOrder);
	}
}

function modifyItemAdd(event) {
	let tr = event.path[2];
	let name = tr.getElementsByClassName('tItemName')[0].innerHTML;

	addToCarByItem({ name: name });
	showCarOnScreen();
	showCarSize();
}

function modifyItemRemove(event) {
	let tr = event.path[2];
	let name = tr.getElementsByClassName('tItemName')[0].innerHTML;

	removeFromCarByItem({ name: name });
	showCarOnScreen();
	showCarSize();
}

function cancelOrder() {
	car.splice(0, car.length);
	showCarOnScreen();
	showCarSize();
}

function confirmOrder() {
	console.log(car);
}

function setInitialSetUp() {
	categoryTitle.innerHTML = 'Burguers';

	fetch(urls['productos'])
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			json.forEach((element) => {
				if (element['name'] === 'Burguers') {
					let prod = element['products'];
					let string = '';
					prod.forEach((elem) => {
						string += putAndGetInColumn(
							createItemCard(elem['image'], elem['name'], elem['description'], elem['price'])
						);
					});
					mainContainer.innerHTML = putAndGetInRow(string);
				}
			});

			setAddToCarEvents();
		});
}
//--------------------------------------------------------------------------------------

carContainer.addEventListener('click', showCarOnScreen);
modalYesBtn.addEventListener('click', cancelOrder);
setCategories();
setInitialSetUp();
