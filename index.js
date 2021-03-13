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
const car = [];

carContainer.addEventListener('click', showCarOnScreen);

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

	console.log(category);
	categoryTitle.innerHTML = category;

	fetch(urls['productos'])
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			json.forEach((element) => {
				if (element['name'] === category) {
					let prod = element['products'];
					let string ='';
					prod.forEach((elem) => {
						string += putAndGetInColumn(
							createItemCard(elem['image'], elem['name'], elem['description'], elem['price'])
						);
					});
					mainContainer.innerHTML=putAndGetInRow(string);
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

function putAndGetInTableContainer(id, table, footer)
{
	return `<div id="${id}" class="container-fluid tableContainer">
				<div class="container-fluid tcTable">
					${table}
				</div>
				<div class="container-fluid d-flex justify-content-between tcFooter">
					${footer}
				</div>
			</div>`;
}

function getCarTable()
{
	let string = '';
	let total = 0;
	let i;
	for(i=0; i<car.length;i++)
	{
		let it=car[i];
		amount = Number(it.price)*Number(it.quantity);
		let tItem=`	<tr>
						<th scope="row">${i+1}</th>
						<td>${it.quantity}</td>
						<td>${it.name}</td>
						<td>${it.price}</td>
						<td>${amount}</td>
						<td>
							<button type="button" class="btn btn-dark more">+</button>
							<button type="button" class="btn btn-dark less">-</button>
						</td>
					</tr>`;
		
		total+=amount;
		string+=tItem;
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

	return [total.toFixed(2),table];
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
						<a href="#" class="btn btn-dark float-left addToCar">Add to car</a>
      				</div>
				</div>`;

	return card;
}

function setAddToCarEvents()
{
	let row = mainContainer.getElementsByClassName('row');
	if(row)
	{
		let r = row[0];
		let collection = r.getElementsByClassName('addToCar');
		let i=0;
		for(i=0;i<collection.length;i++)
		{
			collection[i].addEventListener('click', addToCar);
		}
	}
	
}

function addToCar(event)
{
	let card = event.path[2];
	let title = card.getElementsByClassName('card-title')[0].innerHTML;
	let content = card.getElementsByClassName('card-text')[0].innerHTML;
	let price = card.getElementsByClassName('itemPrice')[0].innerHTML;

	addToCarByItem({name:title, content:content, price:price});
	showCarSize();
	console.log(car);
}


function addToCarByItem(item)
{
	let found=false;
	let i;

	for(i=0; i<car.length;i++)
	{
		let it = car[i];
		console.log(it);
		if(it.name===item.name)
		{
			found=it;
			break;
		}
	}
	
	if(found)
	{
		found.quantity++;
	}
	else{
		let newElem = {quantity:1, name:item.name, content: item.content, price:item.price};
		car.push(newElem);
	}
}

function showCarSize()
{
	let q=0;
	car.forEach((element)=>{
		q+=element.quantity
	});
	amountCarItems.innerHTML=`${q} items`
}

function showCarOnScreen()
{
	let totalAndTable = getCarTable();

	let footer=`
		<div>
			<strong>
				Total: ${totalAndTable[0]}
			</strong>
		</div>
		<div>
			<button type="button" class="btn btn-danger cancelOrder">Cancel</button>
			<button type="button" class="btn btn-light confirmOrder">Confirm Order</button>
		</div>
	
	`;


	mainContainer.innerHTML=putAndGetInTableContainer("tc1", totalAndTable[1], footer);
}

function setInitialSetUp()
{
	categoryTitle.innerHTML = "Burguers";

	fetch(urls['productos'])
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			json.forEach((element) => {
				if (element['name'] === "Burguers") {
					let prod = element['products'];
					let string ='';
					prod.forEach((elem) => {
						string += putAndGetInColumn(
							createItemCard(elem['image'], elem['name'], elem['description'], elem['price'])
						);
					});
					mainContainer.innerHTML=putAndGetInRow(string);
				}
			});

			setAddToCarEvents();
		});
}
//--------------------------------------------------------------------------------------

setCategories();
setInitialSetUp();
