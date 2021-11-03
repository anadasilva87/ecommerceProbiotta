let cart = [];
let modalQt = 1;
let modalKey = 0;
c = (el)=> document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);


yogurtJson.map((item, index)=>{
    let yogurtItem = c('.models .yogurt-item').cloneNode(true);
    yogurtItem.setAttribute('data-key', index);
    yogurtItem.querySelector('.yogurt-item--img img').src = item.img;
    yogurtItem.querySelector('.yogurt-item--price').innerHTML = `A partir deR$ ${item.price.toFixed(2)}`;
    yogurtItem.querySelector('.yogurt-item--name').innerHTML = item.name;
    yogurtItem.querySelector('.yogurt-item--desc').innerHTML = item.description;
    yogurtItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.yogurt-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.yogurtBig img').src = yogurtJson[key].img;
        c('.yogurtInfo h1').innerHTML = yogurtJson[key].name;
        c('.yogurtInfo--desc').innerHTML = yogurtJson[key].description;
        c('.yogurtInfo--actualPrice').innerHTML = `R$ ${yogurtJson[key].price.toFixed(2)}`;
        c('.yogurtInfo--size.selected').classList.remove('selected');
        cs('.yogurtInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex==2){size.classList.add('selected');
        }
            
            size.querySelector('span').innerHTML = yogurtJson[key].sizes[sizeIndex];
        });

        c('.yogurtInfo--qt').innerHTML = modalQt;


        c('.yogurtWindowArea'). style.opacity = 0;
        c('.yogurtWindowArea').style.display= "flex";
        setTimeout(()=>{
            c('.yogurtWindowArea').style.opacity = 1;
        }, 200);

    
    })
    
    c('.yogurt-area').append( yogurtItem ) ;
});


//EVENTOS DO MODAL

function closeModal(){
    c('.yogurtWindowArea'). style.opacity = 0;
    setTimeout(()=>{
        c('.yogurtWindowArea'). style.display = "none";
    }, 500);
}
cs('.yogurtInfo--cancelButton, .yogurtInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

c('.yogurtInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
    modalQt--;
    c('.yogurtInfo--qt').innerHTML = modalQt;}
})

c('.yogurtInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.yogurtInfo--qt').innerHTML = modalQt;
});

cs('.yogurtInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.yogurtInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});

c('.yogurtInfo--addButton').addEventListener('click', ()=>{
    let size = c('.yogurtInfo--size.selected').getAttribute('data-key');
    let identifier = yogurtJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=>{
        return item.identifier == identifier
    })
    if(key>-1){
        cart[key].qt += modalQt;
    } else {
    cart.push({
        identifier,
        id: yogurtJson[modalKey].id,
        size,
        qt: modalQt,
    });
    }
    updateCart();
    closeModal();

});

c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length>0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let yogurtItem = yogurtJson.find((item) => item.id == cart[i].id);
            subtotal += yogurtItem.price * cart[i].qt;
            let cartItem = c('.models .cart--item').cloneNode(true);
            let yogurtSizeName;
            switch(cart[i].size){
                case "0":
                    yogurtSizeName = 'P';
                    break;
                case "1":
                    yogurtSizeName = 'M';
                    break;
                case "2":
                    yogurtSizeName = 'G';
                    break;
                
            }
            let yogurtName = `${yogurtItem.name} (${yogurtSizeName})`;

            cartItem.querySelector('img').src = yogurtItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = yogurtName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt> 1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }

                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}