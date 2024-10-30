const requestUrl = "data.json";

// fetch(requestUrl)
//   .then((Response) => Response.json())
//   .then((json) => displayProducts(json));
fetch(requestUrl)
  .then((response) => response.json())
  .then(displayProducts)
  .catch(console.error);

function displayProducts(allProducts) {
  const productsContainer = document.querySelector(".products-container");

  allProducts.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    const imgHolder = document.createElement("div");
    imgHolder.classList.add("img-holder");
    const imgElement = document.createElement("img");
    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");
    const namePara = document.createElement("p");
    const categoryPara = document.createElement("p");
    const pricePara = document.createElement("p");
    //
    let productImg;
    if (window.innerWidth > 1024) {
      productImg = product.image.desktop;
    } else if (window.innerWidth > 600) {
      productImg = product.image.tablet;
    } else {
      productImg = product.image.mobile;
    }
    imgElement.setAttribute("src", productImg);
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        productImg = product.image.desktop;
      } else if (window.innerWidth > 498) {
        productImg = product.image.tablet;
      } else {
        productImg = product.image.mobile;
      }
      imgElement.setAttribute("src", productImg);
    });

    //
    const newAddToCartElem = createAddToCartElement(product);
    //
    imgHolder.appendChild(imgElement);
    imgHolder.appendChild(newAddToCartElem);
    //
    namePara.innerText = product.name;
    namePara.classList.add("name");
    categoryPara.innerText = product.category;
    categoryPara.classList.add("category");
    pricePara.innerText = `$${product.price}`;
    pricePara.classList.add("price");
    //
    productInfo.appendChild(categoryPara);
    productInfo.appendChild(namePara);
    productInfo.appendChild(pricePara);
    //
    productDiv.appendChild(imgHolder);
    productDiv.appendChild(productInfo);
    //
    productsContainer.appendChild(productDiv);
  });
}
let cartList = [];
function createAddToCartElement(product) {
  // Create the main add-to-cart div
  const addToCartDiv = document.createElement("div");
  addToCartDiv.className = "add-to-cart";

  // Create the image element
  const cartIcon = document.createElement("img");
  cartIcon.src = "assets/images/icon-add-to-cart.svg";
  cartIcon.alt = "cart icon";

  // Create the span for the button text
  const buttonText = document.createElement("span");
  buttonText.className = "main-btn-text";
  buttonText.innerText = "Add To Cart";

  // Create the counter controls div
  const counterControls = document.createElement("div");
  counterControls.className = "counter-controls";
  let localCounter = 0;

  // Create the decrement button
  const decrementButton = document.createElement("button");
  decrementButton.className = "decrement";
  decrementButton.innerText = ""; // You can add an icon or change it as needed
  // add function to the button
  decrementButton.onclick = function decrementCounter() {
    if (localCounter > 0) {
      localCounter--;
      countSpan.innerText = localCounter; // Update the displayed count
    }
    // Go up to the closest .product container from the button clicked
    const productElement = this.closest(".product");

    // Check if productElement is found
    if (productElement) {
      const nameElement = productElement.querySelector(".name");

      if (nameElement) {
        const productName = nameElement.textContent.trim().toLowerCase();
        console.log("Product name:", productName);

        // Find the correct item in cartList by matching productName
        const itemIndex = cartList.findIndex(
          (item) => item.name.trim().toLowerCase() === productName
        );

        if (itemIndex !== -1) {
          removeItem(itemIndex); // Call removeItem if found
        } else {
          console.log("Item not found in cartList.");
          console.log("Cart list contents:", cartList); // Log to compare
        }
      } else {
        console.log("Name element not found in the productElement.");
      }
    } else {
      console.log("Product element not found.");
    }
  };

  // Create the count span
  const countSpan = document.createElement("span");
  countSpan.className = "count";
  countSpan.innerText = localCounter;

  // Create the increment button
  const incrementButton = document.createElement("button");
  incrementButton.className = "increment";
  incrementButton.innerText = ""; // You can add an icon or change it as needed
  //add function
  incrementButton.onclick = function incrementCounter() {
    localCounter++;
    countSpan.innerText = localCounter;
    //
    const thisPElement = this.parentElement.closest(".add-to-cart");
    const thisImgHolder = thisPElement.parentElement;
    const thisProductInfo = thisImgHolder.nextSibling;
    const thisProductName = thisProductInfo.querySelector(".name").innerText;
    const thisProductCate =
      thisProductInfo.querySelector(".category").innerText;
    const thisProductPrice = thisProductInfo.querySelector(".price").innerText;

    let existingItemInCart = cartList.find(
      (item) => item.name === thisProductName
    );
    if (existingItemInCart) {
      existingItemInCart.quantity++;
    } else {
      let itemInList = {
        name: thisProductName,
        price: thisProductPrice,
        quantity: 1,
        thumbnail: product.image.thumbnail,
      };
      cartList.push(itemInList);
    }

    displayCart();
  };
  // Assemble the elements
  counterControls.appendChild(decrementButton);
  counterControls.appendChild(countSpan);
  counterControls.appendChild(incrementButton);

  addToCartDiv.appendChild(cartIcon);
  addToCartDiv.appendChild(buttonText);
  addToCartDiv.appendChild(counterControls);

  // Return the complete add-to-cart div
  return addToCartDiv;
}

function displayCart() {
  console.log();
  const asideCart = document.querySelector(".aside-content");
  const emptyDiv = document.querySelector(".empty-img");
  // Check if cartList is empty and show/hide the emptyDiv accordingly

  // Clear previous items to prevent duplication
  asideCart.innerHTML = "";

  // Loop through cartList and display each item
  cartList.forEach((item) => {
    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cartItem";

    const itemNameHolder = document.createElement("div");
    itemNameHolder.className = "name-icon";

    const textHolder = document.createElement("div");
    textHolder.className = "span-holder";

    const itemNamePara = document.createElement("p");
    itemNamePara.className = "item-name";
    itemNamePara.innerText = item.name;

    const removeBTN = document.createElement("button");
    removeBTN.classList.add("removeItem");
    removeBTN.onclick = () => {
      removeItem(cartList.indexOf(item));
    };

    const priceSpan = document.createElement("span");
    priceSpan.className = "single-price";
    priceSpan.textContent = item.price;

    const quantSpan = document.createElement("span");
    quantSpan.className = "quantity";
    quantSpan.textContent = `${item.quantity}x`;

    const allPriceSpan = document.createElement("span");
    allPriceSpan.className = "multiples-price";
    allPriceSpan.textContent = `$${
      parseFloat(item.price.replace("$", "")) * item.quantity
    }`;

    // Appending elements
    textHolder.appendChild(quantSpan);
    textHolder.appendChild(priceSpan);
    textHolder.appendChild(allPriceSpan);

    itemNameHolder.appendChild(itemNamePara);
    itemNameHolder.appendChild(removeBTN);

    cartItemDiv.appendChild(itemNameHolder);
    cartItemDiv.appendChild(textHolder);

    asideCart.appendChild(cartItemDiv);
  });
  const totalInCart = document.querySelector(".total-in-cart");
  const totalQuantity = cartList.reduce((sum, item) => sum + item.quantity, 0);
  totalInCart.innerText = `(${totalQuantity})`;
  displayTotal(asideCart);
  displayConfirmBTN();
}

function removeItem(index) {
  const item = cartList[index];

  if (item.quantity > 1) {
    // Decrement quantity if more than one
    item.quantity--;
  } else {
    // Remove the item if quantity is 1
    cartList.splice(index, 1);
  }

  displayCart(); // Update the display
}
function displayConfirmBTN() {
  const confirmBTN = document.querySelector(".confirm");
  if (cartList.length > 0) {
    confirmBTN.style.display = "block";
  } else {
    confirmBTN.style.display = "none";
  }
}
function displayTotal(parent) {
  if (cartList.length > 0) {
    const totalDiv = document.createElement("div");
    totalDiv.className = "total-div";
    const totalPara = document.createElement("p");
    totalPara.className = "total-para";
    const totalSpan = document.createElement("span");
    totalSpan.className = "total-span";
    totalPara.textContent = "order total";
    const totalMoney = cartList.reduce((sum, item) => {
      // Remove dollar sign and convert to float
      const price = parseFloat(item.price.replace("$", ""));
      return sum + price * item.quantity;
    }, 0);
    totalSpan.innerText = `$${totalMoney}`;
    totalDiv.appendChild(totalPara);
    totalDiv.appendChild(totalSpan);
    parent.appendChild(totalDiv);
  }
}
//confirm button function
const modal = document.getElementById("modal");
const confirmBTN = document.querySelector(".confirm");
confirmBTN.onclick = () => {
  modal.showModal();
  const conItemsHolder = document.querySelector(".confirmed-items");
  // iterate
  console.log("here");
  cartList.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "con-item";
    const thumbnailImgHolder = document.createElement("img");
    thumbnailImgHolder.className = "thumb-img";
    thumbnailImgHolder.src = item.thumbnail;
    const confirmedName = document.createElement("p");
    confirmedName.className = "con-name";
    confirmedName.innerText = item.name;
    const confirmedQuant = document.createElement("span");
    confirmedQuant.className = "con-quant";
    confirmedQuant.innerText = `${item.quantity}x`;
    const confirmedPrice = document.createElement("span");
    confirmedPrice.className = "con-price";
    confirmedPrice.innerText = item.price;
    const totalPricePerType = document.createElement("span");
    totalPricePerType.className = "con-tot-price";
    totalPricePerType.innerText = `$${(
      parseFloat(item.price.replace("$", "")) * item.quantity
    ).toFixed(2)}`;
    //
    //appending
    itemDiv.append(
      thumbnailImgHolder,
      confirmedName,
      confirmedQuant,
      confirmedPrice,
      totalPricePerType
    );
    conItemsHolder.appendChild(itemDiv);
  });
  displayTotal(conItemsHolder);
};

const resetBTN = document.querySelector(".reset");
resetBTN.onclick = () => {
  modal.close();
  location.reload();
};

displayTotal();
