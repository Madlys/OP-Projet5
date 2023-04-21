//id recovery
const id = new URL(window.location.toLocaleString()).searchParams.get("id");

//stock API URL in var
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

        //if other error, message report by catch
        throw new Error('Une erreur inconnue s\'est produite');
    })
    .then(data => {
        //if product datas are unfined
        if (!data) {
            alert("Victime de son succès, ce produit ne semble plus disponible!")
        }

        //Add product page title
        document.querySelector("title").innerText = data.name;

        //Add product image
        let productImage = document.querySelector(".item__img");
        let imageElement = document.createElement("img");
        imageElement.setAttribute("src", data.imageUrl);
        imageElement.setAttribute("alt", data.altTxt);
        productImage.appendChild(imageElement);

        //Add product title
        document.querySelector("#title").innerText = data.name;

        //Add product price
        document.querySelector("#price").innerText = data.price;

        //Add product description
        document.querySelector("#description").innerText = data.description;

        //Add product color choices
        let productColor = document.querySelector("#colors");
        for (let i = 0; i < data.colors.length; i++) {
            let color = document.createElement("option");
            color.setAttribute("value", data.colors[i]);
            color.innerText = data.colors[i];
            productColor.appendChild(color);
        }

        document.getElementById("addToCart").addEventListener("click", function () {
            //Cart
            const cart = getCart();

            //Product quantity
            let quantity = document.querySelector("#quantity").value;

            //Product color chosed
            let colorChosed = document.querySelector("#colors").value;

            //If no quantity has been selected, error msg
            if (quantity <= 0) {
                alert("Sélectionner une quantité");
                return;
            }

            //If the item don't exist in cart but than the chosed quantity is superior to 100, error msg
            if (quantity > 100) {
                alert("Sélectionner une quantité inférieure ou égale à 100");
                return;
            }

            //If no color has been selected, error msg
            if (!colorChosed) {
                alert("Choisir une couleur");
                return;
            }

            //Add product infos chosed to an object
            const product = {
                id: id,
                quantity: Number(quantity),
                colorChosed: colorChosed
            };

            //Unique id (id+color)
            const key = product.id + product.colorChosed;

            //If there is too many identical items in the cart, error msg
            if (key in cart && quantity > 100 - cart[key].quantity) {
                alert("Sélectionner une quantité inférieure ou égale à " + (100 - cart[key].quantity));
                return;
            }

            //If some identical item(s) exist in cart, addition of the selected quantity to the quantity in the cart
            if (key in cart) {
                cart[key].quantity += product.quantity;

            //If no identical item exist in cart, add to cart
            } else {
                cart[key] = product;
            }

            //Add item to "cart" key in localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
        });
    })
    .catch(error => {
        //alert messsage if error
        alert(error.message);
    });

