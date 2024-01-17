// Order ID recovery
const orderId = new URL(window.location.toLocaleString()).searchParams.get("orderId");

// Displaying the order ID on the confirmation page
let orderIdDisplay = document.getElementById("orderId");
orderIdDisplay.innerText = orderId;