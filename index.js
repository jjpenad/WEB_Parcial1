const urls = {
	productos:
		'https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json'
};

const categoryTitle = document.getElementById('categoryTitle');
const categNav = document.getElementById('categoriesNav');
const rowForItems = document.getElementById('categoryItems').getElementsByClassName('row')[0];

console.log(rowForItems);

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
					rowForItems.innerHTML = '';
					prod.forEach((elem) => {
						rowForItems.innerHTML += putAndGetInColumn(
							createItemCard(elem['image'], elem['name'], elem['description'], elem['price'])
						);
					});
				}
			});
		});
}

function putAndGetInColumn(str) {
	return `<div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 col-xxl-2">${str}</div>`;
}

function createItemCard(src, title, content, price) {
	let card = `<div class="card">
					<img src="${src}" class="card-img-top" alt="item">
					<div class="card-body text-left">
						<h2 class="card-title">${title}</h2>
						<p class="card-text">${content}</p>
						<p><strong>&#36;<span class="itemPrice">${price}</span></strong></p>
						<a href="#" class="btn btn-dark float-left">Add to car</a>
					</div>
				</div>`;

	/*
	<div class="card">
        <img src="..." class="card-img-top" alt="item">
        <div class="card-body text-left">
            <h2 class="card-title">Card title</h2>
            <p class="card-text">Some quick example text to build on the card title and make
                                up the bulk
                                of the card's content.</p>
            <p><strong>&#36;<span class="itemPrice">10.50</span></strong></p>
            <a href="#" class="btn btn-dark float-left">Add to car</a>
        </div>
    </div>

	*/
	return card;
}

//--------------------------------------------------------------------------------------

setCategories();
