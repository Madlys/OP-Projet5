// Product ID recovery
const id = new URL(window.location.toLocaleString()).searchParams.get("id");

// Storing API URL in a constant and product ID adding
const apiUrl = "http://localhost:3000/api/products/" + id;

// Storing response thanks to fetch() method
fetch(apiUrl)
    .then(response => {
        if (response.ok) {
            // Storing API data in form of JSON
            return response.json();
        }

        //If ressoure is not found, message report by catch
        if (response.status == 404) {
            throw new Error('Le produit n\'existe pas');
        }

        // If other error, message report by catch
        throw new Error('Une erreur inconnue s\'est produite');
    })
    .then(data => {
        // If product datas are undefined
        if (!data) {
            alert("Victime de son succès, ce produit ne semble plus disponible!")
        }

        // Adding the product page title
        document.querySelector("title").innerText = data.name;

        // Adding the product image
        let productImage = document.querySelector(".item__img");
        let imageElement = document.createElement("img");
        imageElement.setAttribute("src", data.imageUrl);
        imageElement.setAttribute("alt", data.altTxt);
        productImage.appendChild(imageElement);

        // Adding the product title
        document.querySelector("#title").innerText = data.name;

        // Adding the product price
        document.querySelector("#price").innerText = data.price;

        // Adding the product description
        document.querySelector("#description").innerText = data.description;

        // Added color options for this product
        let productColor = document.querySelector("#colors");
        for (let i = 0; i < data.colors.length; i++) {
            let color = document.createElement("option");
            color.setAttribute("value", data.colors[i]);
            color.innerText = data.colors[i];
            productColor.appendChild(color);
        }

        // Add product to cart function
        document.getElementById("addToCart").addEventListener("click", function () {

            // Cart object
            const cart = getCart();

            // Product quantity value
            let quantity = document.querySelector("#quantity").value;

            // Product color chosed value
            let colorChosed = document.querySelector("#colors").value;

            // If no quantity has been selected, error msg
            if (quantity <= 0) {
                alert("Sélectionner une quantité");
                return;
            }

            // If the item don't exist in cart but than the chosed quantity is superior to 100, error msg
            if (quantity > 100) {
                alert("Sélectionner une quantité inférieure ou égale à 100");
                return;
            }

            // If no color has been selected, error msg
            if (!colorChosed) {
                alert("Choisir une couleur");
                return;
            }

            // Adding product ID, quantity selected and chosen color to an object
            const product = {
                id: id,
                quantity: Number(quantity),
                colorChosed: colorChosed
            };

            // Unique ID creation (ID+color)
            const key = product.id + product.colorChosed;

            // If the total quantity of this item after adding it to the cart is greater than 100, error message
            if (key in cart && quantity > 100 - cart[key].quantity) {
                alert("Sélectionner une quantité inférieure ou égale à " + (100 - cart[key].quantity));
                return;
            }

            /* If identical item(s) exist in the cart,
            adding the selected quantity to the total quantity of that item in the cart*/
            if (key in cart) {
                cart[key].quantity += product.quantity;
            }
            // If no identical item exist in cart, add item to cart
            else {
                cart[key] = product;
            }

            // Adding item to "cart" key in localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
        });
    })
    .catch(error => {
        //alert messsage if error
        alert(error.message);
    });

