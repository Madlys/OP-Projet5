//stock API URL in var
const apiUrl = "http://localhost:3000/api/products";

//Product infos for cart
let productInfos = []

// Defining async function
async function productPage(url) {
    // Storing response thanks to fetch() method
    const response = await fetch(url);

    // Storing API data in form of JSON
    var data = await response.json();

    // id recovery
    let id = window.location.search.match(/[^=]*$/gm)[0];

    // product infos recovery
    let product;
    for (let i = 0; i < data.length; i++) {
        if (data[i]._id === id) {
            product = data[i];
        } else if (data[i].Type) {
            product = searchDepth(data[i].Type, id);
        }
    }
    console.log(product)

    //Add product image
    let productImage = document.querySelector(".item__img");
    let imageElement = document.createElement("img");
    imageElement.setAttribute("src", product.imageUrl);
    imageElement.setAttribute("alt", product.altTxt);
    productImage.appendChild(imageElement);

    //Add product title
    document.querySelector("#title").innerText = product.name;

    //Add product price
    document.querySelector("#price").innerText = product.price;

    //Add product description
    document.querySelector("#description").innerText = product.description;

    //Add product color choices
    let productColor = document.querySelector("#colors");
    for (let i = 0; i < product.colors.length; i++) {
        let color = document.createElement("option");
        color.setAttribute("value", product.colors[i]);
        color.innerText = product.colors[i];
        productColor.appendChild(color);
    }

    //Save information by clicking on the "Ajout au panier" button
    

    //Product quantity
    let quantity;

    //Product color chosed
    let colorChosed = document.querySelector("#colors").value;

    //Add product info to an array
    let infos = [id, quantity, colorChosed]
    console.log(infos)

}

productPage(apiUrl);

