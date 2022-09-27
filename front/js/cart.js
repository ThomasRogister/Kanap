// document.addEventListener('DOMContentLoaded', () => {
//   log.textContent += `DOMContentLoaded\n`;
// });
const basket = document.location.href;

//  RÉCUPÉRATION DES PRODUITS DEPUIS L'API SI ON EST SUR LA PAGE PANIER
if (basket.match("cart")) {

  fetch("http://localhost:3000/api/products")
    // on transforme LA REPONSE EN J.SON
    .then((res) => res.json())
    .then((objetArticles) => {
      console.log(objetArticles)
      showBasket(objetArticles);
    })

    // AFFICHAGE D'UN MESSAGE EN CAS D'ERREUR
    .catch((err) => {
      document
        .querySelector("#cartAndFormContainer")
        .innerHTML = "<h1> Cette page est en maintenance,</<br> nous nous excusons pour la gêne occasionné.</h1>";
      console.log(err);

    });
} else {
  console.log("page confirmation");
}

// function pour inserer HTML dans le DOM de la page panier
function displayCartItem(article, objectArticles) {
  const result = objectArticles.find(p => p._id === article._id);

  document.querySelector("#cart__items")
    .insertAdjacentHTML("beforeend", `<article class="cart__item" data-id="${article._id}" data-color="${article.color}">
    <div class="cart__item__img">
      <img src="${result.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${result.name}</h2>
        <p>${article.color}</p>
        <p>${result.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" onchange="changeQuantity(this.value, "${article._id}")" value="${article.quantity}">
        </div>
        <div id="delete" onclick="removeProduct('${article._id}')" class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`);
}

// aller chercher le panier dans le localStorage -"storedBasket"
// on cherche le produit avec filter 

//IF le produit n'existe pas dans le panier:
// Value === 0, alors on appelle la function remove product

// ELSE le produit existe dans le panier:
// lui ajouter un nouvelle quantité (value +1)
// on doit le renvoyer dans le localStorage - "storedBasket"



function changeQuantity(value, id) {
  const basket = localStorage.getItem("storedBasket");
  const cartJSON = JSON.parse(basket);
  // si un article correspond à l'article rechercher avec "find",  un message d'alert s'affiche et on ajoute la nouvelle quantité du produit contenu dans le panier du localStorage
  cartJSON.find(p => article._id === p._id && article.color === p.color)
  if (!value) {
    removeProduct(id)
  } else {
    const productIndex = cartJSON.findIndex(p => article._id === p._id && article.color === p.color)
    console.log(productIndex)
    const addQuantity = parseInt(article.quantity) + parseInt(cartJSON[productIndex].quantity);
    cartJSON[productIndex].quantity = addQuantity
    localStorage.setItem("storedBasket", JSON.stringify(cartJSON));
  }
}






// Supprimer article du panier
function removeProduct(id) {
  alert('voulez-vous vraiment supprimer cer article?');
  const recupBasket = localStorage.getItem("storedBasket");
  const basketItems = JSON.parse(recupBasket);
  const newBasket = basketItems.filter(p => p._id !== id);
  localStorage.setItem("storedBasket", JSON.stringify(newBasket));
  location.reload();
}

// function pour afficher la somme des prix et de la quantité des articles
function showPriceAndQuantity(listLocalStorage, objectArticles) {
  let totalQuantity = 0;
  let totalPrice = 0;
  listLocalStorage.map(o => {
    const result = objectArticles.find(p => p._id === o._id);
    const itemPrice = result.price;
    const quantity = parseInt(o.quantity);
    const total = quantity * itemPrice;
    totalPrice = total + totalPrice;
    totalQuantity = quantity + totalQuantity;
  })
  document.querySelector("#totalQuantity").innerHTML = `${totalQuantity}`;
  document.querySelector("#totalPrice").innerHTML = `${totalPrice}`;
}


// FUNCTION DETERMINE CONDITIONS AFFICHAGE DU PANIER
function showBasket(objectArticles) {
  // ON RECUP le contenu du localStorage
  const basket = localStorage.getItem("storedBasket");
  // si le panier est vide un msg H1 s'affiche
  if (!basket) {
    document.querySelector("#cart__items").innerHTML = "<h1>panier vide</h1>";
    //sinon les articles s'ajoutent à la page panier
  } else {
    // on transforme le contenu de "basket" en JSON
    const basketItems = JSON.parse(basket);
    basketItems.map(p => displayCartItem(p, objectArticles));
    showPriceAndQuantity(basketItems, objectArticles);
  }
}

// pour la validation du formulaire et la requête POST

// Initialisation des RegExp
let form = document.getElementById("form_order");
const emailRegex = new RegExp('^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-z]{2,10}$');
const lettersRegex = new RegExp('^[a-zA-Z ,.-]+[-a-zA-Zàâäéèêëïîôöùûüç ]+$');
const addressRegex = new RegExp('^[0-9]{1,3}[,. ]{1}[-a-zA-Zàâäéèêëïîôöùûüç ]{5,100}$');

// function pour la validation ou non des champs du formulaire 
function validInput(regex, champ, validesmsg, invalidemsg) {
  champ.addEventListener("change", () => {
    let msg = champ.nextElementSibling;
    if (regex.test(champ.value)) {
      msg.textContent = validesmsg;
    } else {
      msg.textContent = invalidemsg;
    }
  })
};

validInput(lettersRegex, form.firstName, "prénom valide", "prénom invalide")
validInput(lettersRegex, form.lastName, "nom valide", "nom invalide")
validInput(addressRegex, form.address, "adresse valide", "adresse invalide")
validInput(lettersRegex, form.city, "ville valide", "ville invalide")
validInput(emailRegex, form.email, "email valide", "email invalide")

document.getElementById("order").addEventListener("click", (event) => {
  let form = document.getElementById("form_order");
  event.preventDefault();

  if (lettersRegex.test(form.firstName.value) &&
    lettersRegex.test(form.lastName.value) &&
    addressRegex.test(form.address.value) &&
    lettersRegex.test(form.city.value) &&
    emailRegex.test(form.email.value)) {
    const basket = JSON.parse(localStorage.getItem("storedBasket"))
    const data = {
      contact: {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value
      },
      products: basket.map(function (product) {
        return product._id
      })

    }

    console.log(data)
    fetch("http://localhost:3000/api/products/order", {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        window.location = '/front/html/confirmation.html?orderId=' + response.orderId;
        console.log(response)
      })

      // AFFICHAGE D'UN MESSAGE EN CAS D'ERREUR
      .catch((err) => {
        document
          .querySelector("#cartAndFormContainer")
          .innerHTML = "<h1> Cette page est en maintenance,</<br> nous nous excusons pour la gêne occasionné.</h1>";
        console.log(err);

      });

  } else {
    alert("veuillez remplir tous les champs")
  }
})

// form.addEventListener("submit", (event) => {
//   event.preventDefault();
//   let form = document.querySelector(".cart__order__form");
//   console.log(form)
//   // si les infos de tous les champs sont valide, alors on peut passer la commande
//   if (lettersRegex.test(form.firstName.value) &&
//     lettersRegex.test(form.lastName.value) &&
//     addressRegex.test(form.address.value) &&
//     lettersRegex.test(form.city.value) &&
//     emailRegex.test(form.email.value)) {
//     const basket = JSON.parse(localStorage.getItem("storedBasket"));
//     // on créé l'objet "data" contenant les infos du client  (objet construit pour l'envoi à l'API)
//     const data = {
//       contact: {
//         firstName: form.firstName.value,
//         lastName: form.lastName.value,
//         address: form.address.value,
//         city: form.city.value,
//         email: form.email.value
//       },
//       products: basket.map(function (product) {
//         return product._id
//       })
//     }
//     // requête API "POST" pour envoyer l'objet "data" au serveur
//     fetch("http://localhost:3000/api/products/order", {
//       method: 'POST', // or 'PUT'
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     })
//       // on transforme la response en Json
//       .then((res) => res.json())
//       .then((response) => {
//         // on demande que "orderId" soit afficher dans l'URL de la page confirmation
//         // on fait une redirrection (avec windows.location) avec le paramètre orderId qui provient de la response du POST fait sur l'API
//         window.location = 'confirmation.html?orderId=' + response.orderId;

//       })

//       // AFFICHAGE D'UN MESSAGE EN CAS D'ERREUR
//       .catch((err) => {
//         document
//           .querySelector("#cartAndFormContainer")
//           .innerHTML = "<h1> Cette page est en maintenance,</<br> nous nous excusons pour la gêne occasionné.</h1>";
//         console.log(err);

//       });
//     // sinon on indique au client qu'il doit remplir correctement tous les champs du formulaire
//   } else {
//     alert("veuillez remplir tous les champs")
//   }
// })




