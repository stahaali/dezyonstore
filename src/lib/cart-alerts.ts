import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export function alertAddedToCart(productName: string) {
  return Swal.fire({
    icon: "success",
    title: "Added to cart",
    text: `${productName} has been added to your cart.`,
    confirmButtonColor: "#0c2340",
    timer: 2200,
    timerProgressBar: true,
  });
}

export function alertAlreadyInCart(productName: string) {
  return Swal.fire({
    icon: "info",
    title: "Already in cart",
    text: `${productName} is already in your cart. You can change quantity from the cart.`,
    confirmButtonColor: "#0c2340",
  });
}

export function alertOutOfStock() {
  return Swal.fire({
    icon: "warning",
    title: "Out of stock",
    text: "This product is currently unavailable.",
    confirmButtonColor: "#0c2340",
  });
}
