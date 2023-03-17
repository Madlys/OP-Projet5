//stock API URL in var
const apiUrl = "http://localhost:3000/api/products/";

//Price recovery array by item lot
let totalPriceArray = [];
//Item quantity recovery array
let totalQuantityArray = [];

//Local storage conversion thanks to "JSON.parse()" method, to manipulable form (object)
const cart = JSON.parse(localStorage.getItem("cart"));

//for each product of cart
for (const productKey in cart) {
    //Product constant contains product's data
    const product = cart[productKey];

    //Retrieve product data from the API thanks to its id
    fetch(apiUrl + product.id)
        .then(response => {
            if (response.ok) {
                // Storing API data in form of JSON
                return response.json();
            }

            //if error, message report by catch
            throw new Error('Y a un problème chef !');
        })
        .then(data => {
            //Création of <article> element for each item/product, add data attributes (id and color) and id attribute
            let item = document.createElement("article");
            item.setAttribute("class", "cart__item");
            item.setAttribute("data-id", product.id);
            item.setAttribute("data-color", product.colorChosed);
            document.getElementById("cart__items").appendChild(item);

            //Création of <div> element which will contain a picture/img for each item/product, add class attribute
            let img = document.createElement("div");
            img.setAttribute("class", "cart__item__img");
            item.appendChild(img);

            //Création of <div> element for each item/product which will contain a infos about it, add class attribute
            let content = document.createElement("div");
            content.setAttribute("class", "cart__item__content");
            item.appendChild(content);

            //Création of <div> element for each item/product which will contain a description of it, add class attribute
            let contentDescription = document.createElement("div");
            contentDescription.setAttribute("class", "cart__item__content__description");
            content.appendChild(contentDescription);

            //Création of <div> element for each item/product which will contain settings of it, add class attribute
            let contentSettings = document.createElement("div");
            contentSettings.setAttribute("class", "cart__item__content__settings");
            content.appendChild(contentSettings);

            //Création of <div> element (in settings <div>) for each item/product which will contain its quantity, add class attribute
            let contentSettingsQuantity = document.createElement("div");
            contentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
            contentSettings.appendChild(contentSettingsQuantity);

            //Création of <div> element (in settings <div>) for each item/product which will contain a delete button, add class attribute
            let contentSettingsDelete = document.createElement("div");
            contentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
            contentSettings.appendChild(contentSettingsDelete);
            //add button text and a class attribute
            let deleteItem = document.createElement("p");
            deleteItem.setAttribute("class", "deleteItem");
            deleteItem.innerText = "Supprimer";
            deleteItem.addEventListener("click", function () {
                // deleteItem.closest(".cart__item").remove()
                // remove element in cart
                // add cart to local STorage
                // console.log(cart)
                // console.log(cart[deleteItem.closest(".cart__item").dataset["id"] + deleteItem.closest(".cart__item").dataset["color"]])
                // console.log(cart)
            })
            contentSettingsDelete.appendChild(deleteItem);

            //Création of <img> element for each selected item/product (picture of it), add src and alt attributes
            let imgProduct = document.createElement("img");
            imgProduct.setAttribute("src", data.imageUrl);
            imgProduct.setAttribute("alt", data.altTxt);
            img.appendChild(imgProduct);

            //Création of <h2> and <p> elements for each selected item/product, add text (its name, price and color)
            let name = document.createElement("h2");
            name.innerText = data.name;
            contentDescription.appendChild(name);
            let color = document.createElement("p");
            color.innerText = product.colorChosed;
            contentDescription.appendChild(color);
            let price = document.createElement("p");
            price.innerText = data.price + "€";
            contentDescription.appendChild(price);

            //Création of <p> element for each selected item/product, add text (its quantity)
            let quantity = document.createElement("p");
            quantity.innerText = "Qté : ";
            contentSettingsQuantity.appendChild(quantity);

            //For each selected item/product, add price multiplied by quantity (its total) to price recovery array
            totalPriceArray.push(product.quantity * data.price);

            //For each selected item/product, add its quantity to quantity recovery array
            totalQuantityArray.push(Number(product.quantity));

            //Création of <input> element (in settings quantity <div>) for each item/product (number input to 1 to 100)
            let chooseQuantity = document.createElement("input");
            chooseQuantity.setAttribute("type", "number");
            chooseQuantity.setAttribute("class", "itemQuantity");
            chooseQuantity.setAttribute("name", "itemQuantity");
            chooseQuantity.setAttribute("min", 1);
            chooseQuantity.setAttribute("max", 100);
            chooseQuantity.setAttribute("value", product.quantity);
            contentSettingsQuantity.appendChild(chooseQuantity);
            chooseQuantity.setAttribute("contenteditable", "true");
            chooseQuantity.addEventListener("blur", function () {
                cart[deleteItem.closest(".cart__item").dataset["id"] + deleteItem.closest(".cart__item").dataset["color"]].quantity = chooseQuantity.value;
                localStorage.setItem("cart", JSON.stringify(cart));
            })


            //Calulation of total price
            let totalPrice = document.getElementById("totalPrice");
            totalPrice.innerText = totalPriceArray.reduceRight((acc, cur) => acc + cur, 0);

            // Calculation of total quantity
            let totalQuantity = document.getElementById("totalQuantity");
            totalQuantity.innerText = totalQuantityArray.reduceRight((acc, cur) => acc + cur, 0);
        })
        .catch(error => {
            //alert messsage if error
            alert(error.message);
        });
}