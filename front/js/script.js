//stock API URL in var
const apiUrl = "http://localhost:3000/api/products";

// Defining async function
async function getapi(url) {
    // Storing response thanks to fetch() method
    const response = await fetch(url);

    // Storing API data in form of JSON
    var data = await response.json();

    //Generate similar HTML for each product, for a dynamic display
    for (i = 0; i < data.length; i++) {
        //Create HTML anchor
        let itemElement = document.querySelector("#items");
        let a = document.createElement("a");
        let params = new URLSearchParams("id", data[i]._id).toString();
        let Url = "./product.html?" + params;
        a.setAttribute("href", Url);
        // or shorter => a.setAttribute("href", "./product.html?" + URLSearchParams("id", data[i]._id).toString());
        // or shorter, using object data => a.setAttribute("href", "./product.html?id=" + data[i]._id);
        itemElement.appendChild(a);

        let article = document.createElement("article");
        a.appendChild(article);

        //Add product image
        let imageElement = document.createElement("img");
        imageElement.setAttribute("src", data[i].imageUrl);
        imageElement.setAttribute("alt", data[i].altTxt);
        article.appendChild(imageElement);

        //Add product title/name
        let h3 = document.createElement("h3");
        h3.setAttribute("class", "productName");
        h3.innerText = data[i].name;
        article.appendChild(h3);

        //Add product description
        let p = document.createElement("p");
        p.setAttribute("class", "productDescription");
        p.innerText = data[i].description;
        article.appendChild(p);
    }
}
// Calling that async function
getapi(apiUrl);
