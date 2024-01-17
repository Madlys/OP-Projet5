// Storing API URL in a constant
const apiUrl = "http://localhost:3000/api/products";

// Storing response thanks to fetch() method
fetch(apiUrl)
    .then(response => {
        if (response.ok) {
            // Storing API data in form of JSON
            return response.json();
        }
        throw new Error('Une erreur inconnue s\'est produite');
    })
    .then(data => {
        // Iteration over data: Product card creation for each product
        for (i = 0; i < data.length; i++) {
            // Creation of HTML anchor and hyperlink to the product page
            let itemElement = document.querySelector("#items");
            let a = document.createElement("a");
            a.setAttribute("href", '/front/html/product.html?id=' + data[i]._id);
            itemElement.appendChild(a);

            // Card creation
            let article = document.createElement("article");
            a.appendChild(article);

            // Adding the product image
            let imageElement = document.createElement("img");
            imageElement.setAttribute("src", data[i].imageUrl);
            imageElement.setAttribute("alt", data[i].altTxt);
            article.appendChild(imageElement);

            // Adding the product name
            let h3 = document.createElement("h3");
            h3.setAttribute("class", "productName");
            h3.innerText = data[i].name;
            article.appendChild(h3);

            // Adding the product description
            let p = document.createElement("p");
            p.setAttribute("class", "productDescription");
            p.innerText = data[i].description;
            article.appendChild(p);
        }
    })
    .catch(error => {
        alert(error.message);
    });
