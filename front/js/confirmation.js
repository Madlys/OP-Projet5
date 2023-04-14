//Order id recovery
const orderId = new URL(window.location.toLocaleString()).searchParams.get("orderId");

//Display the order id on the confirmation page
let orderIdDisplay = document.getElementById("orderId");
orderIdDisplay.innerText = orderId;