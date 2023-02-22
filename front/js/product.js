//stock API URL in var
const apiUrl = "http://localhost:3000/api/products";

// Defining async function
async function productPage(url) {
    // Storing response thanks to fetch() method
    const response = await fetch(url);

    // Storing API data in form of JSON
    var data = await response.json();

    console.log(window.location.search);

}

productPage(apiUrl);

