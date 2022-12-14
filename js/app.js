const client = contentful.createClient({
    space: 'u7r20k5jit83',
    accessToken: 'NycafKU1CF37YyJ2j9gPOs0Ll9Litljh6Ow3yzOBRec'
})
// variables
    //document.querySelector: Document.querySelector(): Devuelve el primer elemento del documento (utilizando un recorrido primero en profundidad pre ordenado de los nodos del documento) que coincida con el grupo especificado de selectores.
    //DOM: El modelo de objeto de documento (DOM) es una interfaz de programación para los documentos HTML y XML. Facilita una representación estructurada del documento y define de qué manera los programas pueden acceder, al fin de modificar, tanto su estructura, estilo y contenido. El DOM da una representación del documento como un grupo de nodos y objetos estructurados que tienen propiedades y métodos. Esencialmente, conecta las páginas web a scripts o lenguajes de programación.
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const checkOutBtn = document.querySelector('.check-out-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const loginFormDOM = document.querySelector('.main');
const loginFormOverlay = document.querySelector('.login-form-container');
const closeLoginFormBtn = document.querySelector('.close-login-form');
const cartItems = document.querySelector('.cart-items');
const cartTotal= document.querySelector('.cart-total');
const cartContent= document.querySelector('.cart-content');
const productsDOM= document.querySelector('.products-center');
const productsDOMIndex= document.querySelector('.products-center-index');
const productTemplate= document.querySelector('[product-template]')
let searchInput = document.querySelector('[data-search]');
let companyFilterAll = document.querySelector('.btn-all');
let companyFilterChangas = document.querySelector('.btn-changas');
let companyFilterVans = document.querySelector('.btn-vans');
let companyFilterRandom = document.querySelector('.btn-random');
let companyFilterPuma = document.querySelector('.btn-puma');
const priceInput = document.querySelector('.price-filter');
const priceValue = document.querySelector('.price-value');
const newsletterBtn = document.querySelector('.newsletter-btn');
const newsletterMailInput = document.querySelector('.newsletter-mail-input');

checkOutBtn.disabled = true;
checkOutBtn.classList.add('disabled');
// cart
let cart = [];
let buttonsDOM = [];
// getting the products
    //async: Cuando se llama a una función async, esta devuelve un elemento Promise. Cuando la función async devuelve un valor, Promise se resolverá con el valor devuelto. Si la función async genera una excepción o algún valor, Promise se rechazará con el valor generado. Una función async puede contener una expresión await, la cual pausa la ejecución de la función asíncrona y espera la resolución de la Promise pasada y, a continuación, reanuda la ejecución de la función async y devuelve el valor resuelto.
    //await: La expresión await provoca que la ejecución de una función async sea pausada hasta que una Promise sea terminada o rechazada, y regresa a la ejecución de la función async después del término. Al regreso de la ejecución, el valor de la expresión await es la regresada por una promesa terminada. Si la Promise es rechazada, el valor de la expresión await tendrá el valor de rechazo. Si el valor de la expresión seguida del operador await  no es una promesa, será convertido a una resolved Promise.
    //map: El método map() crea un nuevo array con los resultados de la llamada a la función indicada aplicados a cada uno de sus elementos.
class Products{
    async getProducts(){
        try{
            const contentful = await client.getEntries({content_type:'changasProducts'});
            let products = contentful.items;
            products = products.map(item=>{
                const{title,price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                const article = productTemplate.content.cloneNode(true).children[0];
                return {title, price, id, image, element: article};
            })
            return products;
        } catch (error){
            console.log(error);
        }
    }
}
// display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => { //añade productos al HTML de forma dinamica
            result +=`            
            <!-- single product-->
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img"/>
                    <button class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i>
                    add to cart
                    </button>
                </div>
                <div class="product-footer">
                    <h3>${product.title}</h3>
                    <h4>Ksh ${product.price}</h4>
                </div>
            </article>
            <!-- end of single product-->`;
        });
        result += `<div class="products-center-message hide">
                        sorry, no products matched your search
                    </div>`
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            } 
            button.addEventListener("click", event => {
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                // get product from products
                let cartItem = {...Storage.getProduct(id), amount:1};
                // add product to the cart
                cart = [...cart, cartItem];
                // save cart in local storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart);
                // display cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart();
            })
        })
    }
    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat (tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product"/>
        <div>
            <h4>${item.title}</h4>
            <h5>Ksh ${item.price}</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div);
    }
    //función que permite mostrar el carrito, funciona exactamente de manera opuesta que hideCart()
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
        if (cartItems.innerText == 0){
            checkOutBtn.disabled = true;
            checkOutBtn.classList.add('disabled');
        }
        else{
            checkOutBtn.disabled = false;
            checkOutBtn.classList.remove('disabled');
        }
    }
    showLoginForm(){
        loginFormOverlay.classList.add('transparentBcgLoginFormContainer');
        loginFormDOM.classList.add('showLoginForm');
    }
    //función que permite cargar los items que están en local storage, en caso de que existan.
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
        closeLoginFormBtn.addEventListener('click', this.hideLoginForm);
    }
    //function to add item to local storage
    populateCart (cart){
        cart.forEach(item => this.addCartItem(item));
    }
    //
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    hideLoginForm(){
        loginFormOverlay.classList.remove('transparentBcgLoginFormContainer');
        loginFormDOM.classList.remove('showLoginForm');
    }
    cartLogic(){ //
        // clear cart button
        clearCartBtn.addEventListener('click', () =>{
            this.clearCart();
        });
        checkOutBtn.addEventListener('click', () =>{
            this.hideCart();
            this.showLoginForm();
        });
        // cart functionality
        cartContent.addEventListener('click', event =>{
            if (event.target.classList.contains("remove-item")){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
                if (cartItems.innerText == 0){
                    checkOutBtn.disabled = true;
                    checkOutBtn.classList.add('disabled');
                }
                else{
                    checkOutBtn.disabled = false;
                    checkOutBtn.classList.remove('disabled');
                }
            } else if (event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id); 
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains("fa-chevron-down")){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id); 
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
                if (cartItems.innerText == 0){
                    checkOutBtn.disabled = true;
                    checkOutBtn.classList.add('disabled');
                }
                else{
                    checkOutBtn.disabled = false;
                    checkOutBtn.classList.remove('disabled');
                }
            }
        })
    }
    clearCart(){//"remove items"
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        };
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !==id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}
// local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    //
    //
    //
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}
// addEventListener() 
//The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
//
document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI ()
    const products = new Products();
    // setup app
    ui.setupAPP();
    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
        ui.cartLogic();
    });
});
//Search for products
//add Event Listener 
searchInput.addEventListener('input', (e) => {
    priceInput.value = 12000;
    priceValue.textContent = `Value : Ksh ${priceInput.value}`;
    const productsMessageDOM= document.querySelector('.products-center-message');
    const singleProductDOM = document.getElementsByClassName("product");
    for (var i = 0; i < singleProductDOM.length; i++) {
        singleProductDOM[i].classList.remove('hide');
    }
    const value = e.target.value.toLowerCase();
    const invalidSearchArray = []
    for (var i = 0; i < singleProductDOM.length; i++) {
        //
        const isVisible = singleProductDOM[i].children[1].innerHTML.toLowerCase().includes(value);
        //
        singleProductDOM[i].classList.toggle('hide',!isVisible);
        if(!isVisible){
            invalidSearchArray.push('1');
        }
    }
    if(singleProductDOM.length == invalidSearchArray.length ){
        productsMessageDOM.classList.remove('hide');
    }
    else if (singleProductDOM.length != invalidSearchArray.length){
        productsMessageDOM.classList.add('hide');
    };
});
//Filter products bu company
function filterProductsByCompany(e){
        const singleProductDOM = document.getElementsByClassName("product");
        for (var i = 0; i < singleProductDOM.length; i++) {
            singleProductDOM[i].classList.remove('hide');
        }
        const value = e.target.innerHTML.toLowerCase();
        for (var i = 0; i < singleProductDOM.length; i++) {
            //
            const isVisible = singleProductDOM[i].children[1].innerHTML.toLowerCase().includes(value);
            //
            singleProductDOM[i].classList.toggle('hide',!isVisible);
        }
};
//add Event Listener 
companyFilterVans.addEventListener("click", filterProductsByCompany);
companyFilterRandom.addEventListener("click", filterProductsByCompany);
companyFilterPuma.addEventListener("click", filterProductsByCompany);
companyFilterChangas.addEventListener("click", filterProductsByCompany);
//add Event Listener 
companyFilterAll.addEventListener("click", function( e ) {
    const singleProductDOM = document.getElementsByClassName("product");
    for (var i = 0; i < singleProductDOM.length; i++) {
        singleProductDOM[i].classList.remove('hide');
    }
}, false);
//filter the produts by range of price
maxPrice = 12000;
priceInput.value = maxPrice;
priceInput.max = maxPrice;
priceInput.min = 0;
priceValue.textContent = `Value : Ksh ${maxPrice}`;

priceInput.addEventListener('input', function () {
    searchInput.value = '';
    const singleProductDOM = document.getElementsByClassName("product");
    for (var i = 0; i < singleProductDOM.length; i++) {
        singleProductDOM[i].classList.remove('hide');
    }
    const productsMessageDOM= document.querySelector('.products-center-message');
    const value = parseInt(priceInput.value);
    priceValue.textContent = `Value : Ksh${value}`;
    for (var i = 0; i < singleProductDOM.length; i++) {
        //comparar el valor del h4 con el contenido de value
        const isVisible = singleProductDOM[i].children[1].children[1].innerHTML.split('Ksh')[1] <= value;
        //agregarle la clase hide al producto que no coincide con el filtro
        singleProductDOM[i].classList.toggle('hide',!isVisible);
    }
    if(value<1200){
        productsMessageDOM.classList.remove('hide');
    }
    else if (value>=1200){
        productsMessageDOM.classList.add('hide');
    };
});
//login form
var attempt = 3; // Variable to count number of attempts.
// Below function Executes on click of login button.
function validate(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if(username.length > 0 && password.length > 0){
        if ( username == "Gasine" && password == "Gasine"){
            Swal.fire(
                'Good job!',
                'Login succesfully!',
                'success'
            ).then((result)=>{
                if(result.isConfirmed){
                    window.location = "../index.html";
                }
            })
            return false;
        }
        else{
        attempt --;// Decrementing by one.
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You have '+attempt+ ' attempt left',
        })
        // Disabling fields after 3 attempts.
        if( attempt == 0){
        document.getElementById("username").disabled = true;
        document.getElementById("password").disabled = true;
        document.getElementById("submit").disabled = true;
        window.location = "../index.html"; // Redirecting to other page.
        return false;
        }
        }
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'user/password is missing',
        })
    };
}
//Menú hamburguesa
const toggleNav = document.querySelector('.toggle-nav');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const closeBtn = document.querySelector('.sidebar-close');

toggleNav.addEventListener('click', () => {
    sidebarOverlay.classList.add('show');
});
closeBtn.addEventListener('click', () => {
    sidebarOverlay.classList.remove('show');
});
//toastify newsletter confirmation
newsletterBtn.addEventListener('click',() =>{
    let e = newsletterMailInput.value;
    ValidateEmail(e);
    newsletterMailInput.value = '';
});
//función que valida el mail
function ValidateEmail(inputText){
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.match(mailformat)){
        Toastify({
            text: "👍🏼Well done!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
        }).showToast();
        document.form1.text1.focus();
        return true;
    }
    else{
        Toastify({
            text: '🤦🏽‍♂️You have entered an invalid email address!',
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "#ff0000",
            },
        }).showToast();
        document.form1.text1.focus();
        return false;
    }
}