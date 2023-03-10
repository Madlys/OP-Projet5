// id recovery
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

        //if error, message report by catch
        throw new Error('Y a un problème chef !');
    })
    .then(data => {

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

        //Save information by clicking on the "Ajouter au panier" button
        const cart = {};
        document.getElementById("addToCart").addEventListener("click", function () {
            //Product quantity
            let quantity = document.querySelector("#quantity").value;

            //Product color chosed
            let colorChosed = document.querySelector("#colors").value;

            //Add product infos chosed to an object
            const product = {
                id: id,
                quantity: quantity,
                colorChosed: colorChosed
            };

            //const total = quantity +
            if (product.quantity > 0 && product.colorChosed) {
                const key = product.id + product.colorChosed;
                if (key in cart && quantity > 100 - JSON.parse(localStorage.getItem("cart"))[key].quantity) {
                    console.log("trop grand")
                    alert("Sélectionner une quantité inférieure ou égale à " + 100 - JSON.parse(localStorage.getItem("cart"))[key].quantity)
                }
                if (key in cart && product.quantity <= 100 - JSON.parse(localStorage.getItem("cart"))[key].quantity) {
                    console.log("assez petit")
                    cart[key].quantity += product.quantity;
                } else {
                    cart[key] = product;
                }

                localStorage.setItem("cart", JSON.stringify(cart));
            }

            if (quantity <= 0) {
                alert("Sélectionner une quantité")
            }


            if (!colorChosed) {
                alert("Choisir une couleur")
            }

        });
    })
    .catch(error => {
        //alert messsage if error
        alert(error.message);
    });

