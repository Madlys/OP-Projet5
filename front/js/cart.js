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
        //Price recovery array by item lot
        let totalPriceArray = [];
        //Item quantity recovery array
        let totalQuantityArray = [];

        //Local storage conversion thanks to "JSON.parse()" method, to manipulable form (object)
        let product = JSON.parse(localStorage.getItem("cart"));

        //Iteration on product object (here an array of array thanks to "Object.entries" method)
        for (let i = 0; i < Object.entries(product).length; i++) {

            //Création of <article> element for each item/product, add data attributes (id and color) and id attribute
            let item = document.createElement("article");
            item.setAttribute("class", "cart__item");
            item.setAttribute("data-id", Object.entries(product)[i][1].id);
            item.setAttribute("data-color", Object.entries(product)[i][1].colorChosed);
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
            contentSettingsDelete.appendChild(deleteItem);

            //Iteration on API data
            for (let j = 0; j < data.length; j++) {
                //Selection of product by id only if it's in cart
                if (data[j]._id == Object.entries(product)[i][1].id) {

                    //Création of <img> element for each selected item/product (picture of it), add src and alt attributes
                    let imgProduct = document.createElement("img");
                    imgProduct.setAttribute("src", data[j].imageUrl);
                    imgProduct.setAttribute("alt", data[j].altTxt);
                    img.appendChild(imgProduct);

                    //Création of <h2> and <p> elements for each selected item/product, add text (its name, price and color)
                    let name = document.createElement("h2");
                    name.innerText = data[j].name;
                    contentDescription.appendChild(name);
                    let color = document.createElement("p");
                    color.innerText = Object.entries(product)[i][1].colorChosed;
                    contentDescription.appendChild(color);
                    let price = document.createElement("p");
                    price.innerText = data[j].price + "€";
                    contentDescription.appendChild(price);

                    //Création of <p> element for each selected item/product, add text (its quantity)
                    let quantity = document.createElement("p");
                    quantity.innerText = "Qté : " + Object.entries(product)[i][1].quantity;
                    contentSettingsQuantity.appendChild(quantity);

                    //For each selected item/product, add price multiplied by quantity (its total) to price recovery array
                    totalPriceArray.push(Object.entries(product)[i][1].quantity * data[j].price);

                    //For each selected item/product, add its quantity to quantity recovery array
                    totalQuantityArray.push(Number(Object.entries(product)[i][1].quantity));
                }
            }

            //Création of <input> element (in settings quantity <div>) for each item/product (number input to 1 to 100)
            let chooseQuantity = document.createElement("input");
            chooseQuantity.setAttribute("type", "number");
            chooseQuantity.setAttribute("class", "itemQuantity");
            chooseQuantity.setAttribute("name", "itemQuantity");
            chooseQuantity.setAttribute("min", 1);
            chooseQuantity.setAttribute("max", 100);
            chooseQuantity.setAttribute("value", Object.entries(product)[i][1].quantity);
            contentSettingsQuantity.appendChild(chooseQuantity);

        }

        //Calule of total price
        let totalPrice = document.getElementById("totalPrice");
        totalPrice.innerText = totalPriceArray.reduceRight((acc, cur) => acc + cur, 0);

        // Calcule of total quantity
        let totalQuantity = document.getElementById("totalQuantity");
        totalQuantity.innerText = totalQuantityArray.reduceRight((acc, cur) => acc + cur, 0);

    })
    .catch(error => {
        //alert messsage if error
        alert(error.message);
    });
