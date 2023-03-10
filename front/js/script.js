//stock API URL in var
const apiUrl = "http://localhost:3000/api/products";

// Storing response thanks to fetch() method
fetch(apiUrl)
    .then(response => {
        if (response.ok) {
            // Storing API data in form of JSON
            return response.json();
        }

        //if error, message report by catch
        throw new Error('Y a un problème chef !');
    })
    .then(data => {
        //Iterate on data
        for (i = 0; i < data.length; i++) {
            //Create HTML anchor
            let itemElement = document.querySelector("#items");
            let a = document.createElement("a");
            let productFrontUrl = new URL("product.html", 'http://127.0.0.1:5500/front/html/?id=ergreg&categorie=rgbdbre&');
            productFrontUrl.searchParams.append('id', data[i]._id);
            a.setAttribute("href", productFrontUrl);
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
    })
    .catch(error => {
        //alert messsage if error
        alert(error.message);
    });
