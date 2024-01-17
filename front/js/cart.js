// Storing API URL in a constant
const apiUrl = "http://localhost:3000/api/products/";

// Total price value initialization
let totalPriceValue = 0;
// Total item quantity value initialization
let totalQuantityValue = 0;

// Checking input using regexp
const isInputValid = (inputId, inputLabel, regexp) => {
    const input = document.getElementById(inputId);
    let isValid = true;
    // If the input is empty, display an error message and return false
    if (input.value.length == 0) {
        input.nextElementSibling.innerText = "Veuiller saisir votre " + inputLabel + ".";
        isValid = false;
    }
    // If the input format don't match with the regexp, display an error message and return false
    else if (!input.value.match(regexp)) {
        input.nextElementSibling.innerText = "Votre " + inputLabel + " n'est pas au bon format.";
        isValid = false;
    }
    // If the input value is in expected format, no error msg and return true
    else {
        input.nextElementSibling.innerText = "";
    }

    return isValid;
};


/*  Local storage conversion using "JSON.parse()" method in getCart() function,
to manipulable form (object in a constante) */
const cart = getCart();

// If cart object is empty
if (localStorage.getItem("cart") == null || Object.keys(cart).length == 0) {
    //change cart message
    document.getElementById("cartAndFormContainer").firstElementChild.innerText = "Votre panier est vide";
    // hide the total price sentence and the form
    document.getElementById("cartAndFormContainer").lastElementChild.style.display = "none";
}
// If cart object contains item(s)
else {
    // change cart message
    document.getElementById("cartAndFormContainer").firstElementChild.innerText = "Votre panier";
    // display the total price sentence and the form
    document.getElementById("cartAndFormContainer").lastElementChild.removeAttribute("display");

    // For each product in cart...
    for (const productKey in cart) {
        // Product constant contains product's datas
        const product = cart[productKey];

        // Recovery of product data, from the API, using its ID
        fetch(apiUrl + product.id)
            .then(response => {
                if (response.ok) {
                    // Storing datas from API as JSON
                    return response.json();
                }

                // If error, message report by catch
                throw new Error('Une erreur inconnue s\'est produite');
            })
            .then(data => {
                // Creating a <article> element, adding data (ID and color) and ID attributes
                let item = document.createElement("article");
                item.setAttribute("class", "cart__item");
                item.setAttribute("data-id", product.id);
                item.setAttribute("data-color", product.colorChosed);
                document.getElementById("cart__items").appendChild(item);

                // Creating a <div> element which will contain the product picture/img, adding class attribute
                let img = document.createElement("div");
                img.setAttribute("class", "cart__item__img");
                item.appendChild(img);

                // Creating a <div> element which will contain the product infos, adding class attribute
                let content = document.createElement("div");
                content.setAttribute("class", "cart__item__content");
                item.appendChild(content);

                // Creating a <div> element which will contain the product description, adding class attribute
                let contentDescription = document.createElement("div");
                contentDescription.setAttribute("class", "cart__item__content__description");
                content.appendChild(contentDescription);

                // Creating a <div> element which will contain the product settings, adding class attribute
                let contentSettings = document.createElement("div");
                contentSettings.setAttribute("class", "cart__item__content__settings");
                content.appendChild(contentSettings);

                // Creating a <div> element (in <div> settings) which will contain the product quantity, adding class attribute
                let contentSettingsQuantity = document.createElement("div");
                contentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
                contentSettings.appendChild(contentSettingsQuantity);

                //Creating a <div> element (in <div> settings) which will contain a delete button, adding class attribute
                let contentSettingsDelete = document.createElement("div");
                contentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
                contentSettings.appendChild(contentSettingsDelete);
                // adding button text and a class attribute
                let deleteItem = document.createElement("p");
                deleteItem.setAttribute("class", "deleteItem");
                deleteItem.innerText = "Supprimer";
                contentSettingsDelete.appendChild(deleteItem);

                // Creating an <img> element (product picture), adding src and alt attributes
                let imgProduct = document.createElement("img");
                imgProduct.setAttribute("src", data.imageUrl);
                imgProduct.setAttribute("alt", data.altTxt);
                img.appendChild(imgProduct);

                // Creating a <h2> and <p> elements, adding text (product name, price and color)
                let name = document.createElement("h2");
                name.innerText = data.name;
                contentDescription.appendChild(name);
                let color = document.createElement("p");
                color.innerText = product.colorChosed;
                contentDescription.appendChild(color);
                let price = document.createElement("p");
                price.innerText = data.price + "€";
                contentDescription.appendChild(price);

                // Creating a <p> element, adding text (product quantity)
                let quantity = document.createElement("p");
                quantity.innerText = "Qte : ";
                contentSettingsQuantity.appendChild(quantity);

                // Adding price multiplied by quantity (total product) to price value
                totalPriceValue += data.price * product.quantity;

                // Adding product quantity to quantity value
                totalQuantityValue += Number(product.quantity);

                // Creating an <input> element (in <div> settings quantity, number input to 1 to 100)
                let chooseQuantity = document.createElement("input");
                chooseQuantity.setAttribute("type", "number");
                chooseQuantity.setAttribute("class", "itemQuantity");
                chooseQuantity.setAttribute("name", "itemQuantity");
                chooseQuantity.setAttribute("min", 1);
                chooseQuantity.setAttribute("max", 100);
                chooseQuantity.setAttribute("value", product.quantity);
                contentSettingsQuantity.appendChild(chooseQuantity);
                chooseQuantity.setAttribute("contenteditable", "true");

                // Display of total price
                let totalPrice = document.getElementById("totalPrice");
                totalPrice.innerText = totalPriceValue;

                // Display of total quantity
                let totalQuantity = document.getElementById("totalQuantity");
                totalQuantity.innerText = totalQuantityValue;

                // Change quantity event
                chooseQuantity.addEventListener("change", function (event) {
                    // if the selected value is superior to 100, error msg
                    if (chooseQuantity.value > 100) {
                        alert("Selectionner une quantite inferieure ou egale à 100");
                        //Displays the previous/initiale value
                        chooseQuantity.value = chooseQuantity.getAttribute("value");
                    }
                    // if the selected value is 0
                    else if (chooseQuantity.value == 0) {
                        // call delete button click event to delete item
                        let undo = deleteItem.click();
                        // if the user choose "Cancel", show the previous/initiale value
                        if (!undo) {
                            chooseQuantity.value = chooseQuantity.getAttribute("value");
                        }
                    } else {
                        // Recalculation total item quantity and total price
                        totalQuantity.innerText = totalQuantityValue += (chooseQuantity.value - cart[product.id + product.colorChosed].quantity);
                        totalPrice.innerText = totalPriceValue += ((chooseQuantity.value - cart[product.id + product.colorChosed].quantity) * data.price);
                        // Quantity value change in LocalStorage
                        cart[product.id + product.colorChosed].quantity = chooseQuantity.value;
                        localStorage.setItem("cart", JSON.stringify(cart));
                        // Quantity value change in value attribute element
                        chooseQuantity.setAttribute("value", chooseQuantity.value);
                    }
                });

                // Delete button, "click" event
                deleteItem.addEventListener("click", function () {
                    // At displaying delete confirm message ...
                    // if user choose "OK"
                    if (window.confirm("Souhaitez-vous supprimer cet article?")) {
                        const elementToDelete = deleteItem.closest(".cart__item");
                        // Recalculation total item quantity and total price
                        totalQuantity.innerText = totalQuantityValue -= cart[product.id + product.colorChosed].quantity;
                        totalPrice.innerText = totalPriceValue -= (cart[product.id + product.colorChosed].quantity * data.price);
                        // Delation of item datas in LocalStorage
                        delete cart[elementToDelete.dataset["id"] + elementToDelete.dataset["color"]];
                        localStorage.setItem("cart", JSON.stringify(cart));
                        // Delation of item DOM element
                        elementToDelete.remove();
                        // If the product was the last item in cart...
                        if (localStorage.getItem("cart") == null || Object.keys(cart).length == 0) {
                            // change cart message
                            document.getElementById("cartAndFormContainer").firstElementChild.innerText = "Votre panier est vide";
                            // hide the total sentence and the form
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

// Form submit event
document.getElementById("order").closest("form").addEventListener("submit", function (event) {
    // stop form submission default comportement
    event.preventDefault();

    // Form datas submitting
    let productsId = [];
    for (let i = 0; i < Object.entries(cart).length; i++) {
        productsId.push(Object.entries(cart)[i][1].id);
    }

    // Using regexp...
    // Checking of First Name format
    let isFormValid = isInputValid("firstName", "prenom", /^[A-Za-z][à-öù-üa-zA-Z -]*[à-öù-üa-z]$/gm);

    //Checking of Last Name format
    isFormValid = isInputValid("lastName", "nom", /^[A-Za-z][à-öù-üa-zA-Z -]*[à-öù-üa-z]$/gm) && isFormValid;

    //Checking of Adress format
    isFormValid = isInputValid("address", "adresse", /^([0-9]*( bis| ter)?,? )?([à-öù-üa-zA-Z -']{3,}[à-öù-üa-z]$)/gm) && isFormValid;

    //Checking of City format
    isFormValid = isInputValid("city", "ville", /^[A-Za-z][à-öù-üa-zA-Z -]*[à-öù-üa-z]$/gm) && isFormValid;

    //Checking of Mail format
    isFormValid = isInputValid("email", "email", /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/gm) && isFormValid;

    // If all form inputs format are valid
    if (isFormValid) {
        // Request body construction
        const requestBody = {
            contact: {},
            products: productsId
        };
        document.querySelectorAll('form.cart__order__form input:not([type=submit])').forEach((element) => {
            requestBody.contact[element.id] = element.value;
        });

        // POST request
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

                // If error, message report by catch
                throw new Error("Une erreur inconnue s'est produite");
            })
            .then(data => {
                // Clear the cart by emptying the local storage
                localStorage.clear();

                // Redirect to order confirmation page and add order ID to URL
                window.location.href = "../html/confirmation.html?orderId=" + data.orderId;
            })
            .catch(error => {
                // alert messsage if error
                alert(error.message);
            });
    }
})