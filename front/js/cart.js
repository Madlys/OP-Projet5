//stock API URL in var
const apiUrl = "http://localhost:3000/api/products/";

//Total price value
let totalPriceValue = 0;
//Total item quantity value
let totalQuantityValue = 0;

//Check input thanks to regexp
const isInputValid = (inputId, inputLabel, regexp) => {
    const input = document.getElementById(inputId);
    let isValid = true;
    //Check if the input is empty, if not, display an error msg and return false
    if (input.value.length == 0) {
        input.nextElementSibling.innerText = "Veuiller saisir votre " + inputLabel + ".";
        isValid = false;
    }
    //Check if the input format match with the regexp, if not, display an error msg and return false
    else if (!input.value.match(regexp)) {
        input.nextElementSibling.innerText = "Votre " + inputLabel + " n'est pas au bon format.";
        isValid = false;
    }
    //If there is an input value in expected format, no error msg and return true
    else {
        input.nextElementSibling.innerText = "";
    }

    return isValid;
};


//Local storage conversion thanks to "JSON.parse()" method, to manipulable form (object) (in getCart())
const cart = getCart();
if (localStorage.getItem("cart") == null || Object.keys(cart).length == 0) {
    //change cart message
    document.getElementById("cartAndFormContainer").firstElementChild.innerText = "Votre panier est vide";
    //hide the total sentence and the form
    document.getElementById("cartAndFormContainer").lastElementChild.style.display = "none";
} else {
    //change cart message
    document.getElementById("cartAndFormContainer").firstElementChild.innerText = "Votre panier";
    //display the total sentence and the form
    document.getElementById("cartAndFormContainer").lastElementChild.removeAttribute("display");

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
                throw new Error('Une erreur inconnue s\'est produite');
            })
            .then(data => {
                //Creation of <article> element for each item/product, add data attributes (id and color) and id attribute
                let item = document.createElement("article");
                item.setAttribute("class", "cart__item");
                item.setAttribute("data-id", product.id);
                item.setAttribute("data-color", product.colorChosed);
                document.getElementById("cart__items").appendChild(item);

                //Creation of <div> element which will contain a picture/img for each item/product, add class attribute
                let img = document.createElement("div");
                img.setAttribute("class", "cart__item__img");
                item.appendChild(img);

                //Creation of <div> element for each item/product which will contain a infos about it, add class attribute
                let content = document.createElement("div");
                content.setAttribute("class", "cart__item__content");
                item.appendChild(content);

                //Creation of <div> element for each item/product which will contain a description of it, add class attribute
                let contentDescription = document.createElement("div");
                contentDescription.setAttribute("class", "cart__item__content__description");
                content.appendChild(contentDescription);

                //Creation of <div> element for each item/product which will contain settings of it, add class attribute
                let contentSettings = document.createElement("div");
                contentSettings.setAttribute("class", "cart__item__content__settings");
                content.appendChild(contentSettings);

                //Creation of <div> element (in settings <div>) for each item/product which will contain its quantity, add class attribute
                let contentSettingsQuantity = document.createElement("div");
                contentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
                contentSettings.appendChild(contentSettingsQuantity);

                //Creation of <div> element (in settings <div>) for each item/product which will contain a delete button, add class attribute
                let contentSettingsDelete = document.createElement("div");
                contentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
                contentSettings.appendChild(contentSettingsDelete);
                //add button text and a class attribute
                let deleteItem = document.createElement("p");
                deleteItem.setAttribute("class", "deleteItem");
                deleteItem.innerText = "Supprimer";
                contentSettingsDelete.appendChild(deleteItem);

                //Creation of <img> element for each selected item/product (picture of it), add src and alt attributes
                let imgProduct = document.createElement("img");
                imgProduct.setAttribute("src", data.imageUrl);
                imgProduct.setAttribute("alt", data.altTxt);
                img.appendChild(imgProduct);

                //Creation of <h2> and <p> elements for each selected item/product, add text (its name, price and color)
                let name = document.createElement("h2");
                name.innerText = data.name;
                contentDescription.appendChild(name);
                let color = document.createElement("p");
                color.innerText = product.colorChosed;
                contentDescription.appendChild(color);
                let price = document.createElement("p");
                price.innerText = data.price + "€";
                contentDescription.appendChild(price);

                //Creation of <p> element for each selected item/product, add text (its quantity)
                let quantity = document.createElement("p");
                quantity.innerText = "Qte : ";
                contentSettingsQuantity.appendChild(quantity);

                //For each selected item/product, add price multiplied by quantity (its total) to price value
                totalPriceValue += data.price * product.quantity;

                //For each selected item/product, add its quantity to quantity value
                totalQuantityValue += Number(product.quantity);

                //Creation of <input> element (in settings quantity <div>) for each item/product (number input to 1 to 100)
                let chooseQuantity = document.createElement("input");
                chooseQuantity.setAttribute("type", "number");
                chooseQuantity.setAttribute("class", "itemQuantity");
                chooseQuantity.setAttribute("name", "itemQuantity");
                chooseQuantity.setAttribute("min", 1);
                chooseQuantity.setAttribute("max", 100);
                chooseQuantity.setAttribute("value", product.quantity);
                contentSettingsQuantity.appendChild(chooseQuantity);
                chooseQuantity.setAttribute("contenteditable", "true");

                //Display of total price value
                let totalPrice = document.getElementById("totalPrice");
                totalPrice.innerText = totalPriceValue;

                //Display of total quantity value
                let totalQuantity = document.getElementById("totalQuantity");
                totalQuantity.innerText = totalQuantityValue;

                //Change quantity input event
                chooseQuantity.addEventListener("change", function (event) {
                    //if the selected value is superior to 100, error msg
                    if (chooseQuantity.value > 100) {
                        alert("Selectionner une quantite inferieure ou egale à 100");
                        //Displays the previous/initiale value
                        chooseQuantity.value = chooseQuantity.getAttribute("value");
                    }
                    //if the selected value is 0
                    else if (chooseQuantity.value == 0) {
                        //call delete button click event to delete item
                        let undo = deleteItem.click();
                        //if the user choose "Cancel", displays the previous/initiale value
                        if (!undo) {
                            chooseQuantity.value = chooseQuantity.getAttribute("value");
                        }
                    } else {
                        //Recalculate total item quantity and total price
                        totalQuantity.innerText = totalQuantityValue += (chooseQuantity.value - cart[product.id + product.colorChosed].quantity);
                        totalPrice.innerText = totalPriceValue += ((chooseQuantity.value - cart[product.id + product.colorChosed].quantity) * data.price);
                        //Quantity value change in LocalStorage
                        cart[product.id + product.colorChosed].quantity = chooseQuantity.value;
                        localStorage.setItem("cart", JSON.stringify(cart));
                        //Quantity value change in value attribute element
                        chooseQuantity.setAttribute("value", chooseQuantity.value);
                    }
                });

                //Delete button click event
                deleteItem.addEventListener("click", function () {
                    //Display confirm message
                    //if user choose "OK"
                    if (window.confirm("Souhaitez-vous supprimer cet article?")) {
                        const elementToDelete = deleteItem.closest(".cart__item");
                        //Recalculate total item quantity and total price
                        totalQuantity.innerText = totalQuantityValue -= cart[product.id + product.colorChosed].quantity;
                        totalPrice.innerText = totalPriceValue -= (cart[product.id + product.colorChosed].quantity * data.price);
                        //Delation of item datas in LocalStorage
                        delete cart[elementToDelete.dataset["id"] + elementToDelete.dataset["color"]];
                        localStorage.setItem("cart", JSON.stringify(cart));
                        //Delation of item in DOM
                        elementToDelete.remove();
                        if (localStorage.getItem("cart") == null || Object.keys(cart).length == 0) {
                            //change cart message
                            document.getElementById("cartAndFormContainer").firstElementChild.innerText = "Votre panier est vide";
                            //hide the total sentence and the form
                            document.getElementById("cartAndFormContainer").lastElementChild.style.display = "none";
                        }
                    }
                });
            })
            .catch(error => {
                //alert messsage if error
                alert(error.message);
            });
    }
}

//Form submit event
document.getElementById("order").closest("form").addEventListener("submit", function (event) {
    //stop form submission
    event.preventDefault();

    //Form datas submit
    let productsId = [];
    for (let i = 0; i < Object.entries(cart).length; i++) {
        productsId.push(Object.entries(cart)[i][1].id);
    }

    //Check First Name format
    let isFormValid = isInputValid("firstName", "prenom", /^[A-Za-z][à-öù-üa-zA-Z -]*[à-öù-üa-z]$/gm);

    //Check Last Name format
    isFormValid = isInputValid("lastName", "nom", /^[A-Za-z][à-öù-üa-zA-Z -]*[à-öù-üa-z]$/gm) && isFormValid;

    //Check Adress format
    isFormValid = isInputValid("address", "adresse", /^([0-9]*( bis| ter)?,? )?([à-öù-üa-zA-Z -']{3,}[à-öù-üa-z]$)/gm) && isFormValid;

    //Check City format
    isFormValid = isInputValid("city", "ville", /^[A-Za-z][à-öù-üa-zA-Z -]*[à-öù-üa-z]$/gm) && isFormValid;

    //Check Mail format
    isFormValid = isInputValid("email", "email", /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gm) && isFormValid;

    //if all form input format are valid
    if (isFormValid) {
        //request body construction
        const requestBody = {
            contact: {},
            products: productsId
        };
        document.querySelectorAll('form.cart__order__form input:not([type=submit])').forEach((element) => {
            requestBody.contact[element.id] = element.value;
        });

        //post request
        fetch(apiUrl + 'order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (response.ok) {
                    // Storing API data in form of JSON
                    return response.json();
                }

                //if error, message report by catch
                throw new Error("Une erreur inconnue s'est produite");
            })
            .then(data => {
                //Clear the cart by emptying the local storage
                localStorage.clear();

                //Redirect to the confirmation page and add the order ID to the URL
                window.location.href = "../html/confirmation.html?orderId=" + data.orderId;
            })
            .catch(error => {
                //alert messsage if error
                alert(error.message);
            });
    }
})