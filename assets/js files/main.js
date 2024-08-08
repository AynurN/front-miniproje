const sliderURL="http://localhost:3000/sliders";
let slider=document.getElementById("slider");
let slideButton=document.getElementById("slideButtons");
let catCards=document.getElementById("categories-card");
let cat=document.getElementById("cat");
let selection=document.getElementById("selection")
let search=document.getElementById("search");
const categoryURL="http://localhost:3003/categories";
let products=document.getElementById("productCards");
let allCats=document.getElementById("all");
document.querySelector("#search").addEventListener("keydown", function(e) {
  if (e.key === 'Enter' || e.keyCode === 13) {
  e.preventDefault();
  products.innerHTML = '';
  if(e.target.value !=""){
  fetch(categoryURL)
      .then(response => response.json())
      .then(data => {
          data.forEach(cat => {
              cat.products.forEach(pro => {
                  if (pro.desc.toLowerCase().includes(e.target.value.toLowerCase())) {
                      products.innerHTML += `
                      <div class="card" style="width: 16rem; margin: 15px;">
                          <img class="card-img-top" src="${pro.img}" alt="Card image cap">
                          <p style="color: gray; margin: 15px;"></p>
                          <div class="card-body">
                              <p class="card-text" style="font-weight: bold;">${pro.desc}</p>
                              <i style="color: gold" class="fa-solid fa-star"></i>
                              <i style="color: gold" class="fa-solid fa-star"></i>
                              <i style="color: gold" class="fa-solid fa-star"></i>
                              <i style="color: gold" class="fa-solid fa-star"></i>
                              <i style="color: gold" class="fa-regular fa-star"></i>
                              <p style="font-size: 15px;">By <span style="color: green;">${pro.company}</span></p>
                              <div style="display: flex; justify-content: space-between;">
                                  <p style="font-weight: bold; color: gray;">
                                      <span style="color: #3BB77E; font-size: 20px;">$${pro.price}</span> $${pro.oldPrice}
                                  </p>
                                  <button class="btn btn-success"><i class="fa-solid fa-cart-shopping"></i> Add</button>
                              </div>
                          </div>
                      </div>`;
                  }
              });
          });
          products.scrollIntoView({ behavior: 'smooth' });
      })}
    else{
      window.location.reload();
    }}
});
fetch(sliderURL)
    .then(response => response.json())
    .then(datas => {
        slider.innerHTML = '';
        slideButton.innerHTML = '';
        slideButton.innerHTML += `
            <button type="button" data-bs-target="#carouselExampleCaptions" class="active" data-bs-slide-to="0" aria-label="Slide 1"></button>`;
        slider.innerHTML += `
            <div class="carousel-item active">
                <img src="${datas[0].img}" class="d-block w-100" alt="...">
                <div class="carousel-caption d-none d-md-block">
                    <h1>${datas[0].desc}</h1>
                    <p>${datas[0].add}</p>
                    <form action="" style="position: relative; width: 300px;">
                        <input type="email" placeholder="Your email address">
                        <button class="btn btn-success" type="submit" style="position: absolute; right: 0;">Subscribe</button>
                    </form>
                </div>
            </div>`;
        datas.forEach((element, index) => {
            if (index > 0) {
                slideButton.innerHTML += `
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${index}" aria-label="Slide ${index + 1}"></button>`;
                slider.innerHTML += `
                    <div class="carousel-item">
                        <img src="${element.img}" class="d-block w-100" alt="...">
                        <div class="carousel-caption d-none d-md-block">
                            <h1>${element.desc}</h1>
                            <p>${element.add}</p>
                            <form action="" style="position: relative; width: 300px;">
                                <input type="email" placeholder="Your email address">
                                <button class="btn btn-success" type="submit" style="position: absolute; right: 0;">Subscribe</button>
                            </form>
                        </div>
                    </div>`;
            }
        });
        new bootstrap.Carousel(slider, {
            interval: 4000, 
            ride: 'carousel'
        });
    })
    .catch(error => console.error("Error fetching the data:", error));

 


fetch(categoryURL)
.then(response=> response.json())
.then(datas=>{
   datas.forEach(data=>{
    cat.innerHTML += `
    <a href="${categoryURL}/${data.id}" style="margin-inline: 30px; margin-top: 20px; font-weight: 600; color:black; " class="cat-name">${data.Name}</a>
  `
  
   document.querySelectorAll(".cat-name").forEach(btn=>
    btn.addEventListener("click", function(e){
      e.preventDefault();
      products.innerHTML='';
      fetch(e.target.href)
      .then(response=>response.json())
      .then(cat=>{
        getProductsByCat(cat);
        products.scrollIntoView({ behavior: 'smooth' });
      }
       
      )
    })
   )

   document.querySelector("#all").addEventListener("click",function(e){
    e.preventDefault();
    products.innerHTML='';
    fetch(categoryURL)
    .then(response=>response.json())
    .then(cate=> {
      cate.forEach(cat=>{
        getProductsByCat(cat)}
      )
      products.scrollIntoView({ behavior: 'smooth' });
    })
   })
 


 } )
   datas.forEach(data=>{
    catCards.innerHTML+=`
    <div class="cat-card" data-url="${categoryURL}/${data.id}" style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 170px; margin:15px; border-radius: 10px; border: 1px solid #F4F6FA; background-color: #F4F6FA;">
    <img src="${data.img}" alt="" style="margin-bottom: 15px;">
    <p style="font-weight: bold; margin-bottom: 0;">${data.Name}</p>
    <p>${data.products.length} items</p>
   </div> 
    `
    document.querySelectorAll(".cat-card").forEach(btn => {
      btn.addEventListener("click", function(e) {
          e.preventDefault();
          products.innerHTML = '';
          const url = e.currentTarget.dataset.url;
          fetch(url)
              .then(response => response.json())
              .then(cat => {
                  getProductsByCat(cat);
                  products.scrollIntoView({ behavior: 'smooth' });
              })
              .catch(error => {
                  console.error("Error fetching the data:", error);
              });
      });
  });
})
})

fetch(categoryURL)
.then(response=>response.json())
.then(datas=>{
  products.innerHTML='';
  datas.forEach(data=>
    getProductsByCat(data)
  )

})
function getProductsByCat(category){
  category.products.forEach(product=>{
     products.innerHTML+=`
     <div class="card" style="width: 16rem; margin: 15px;" >
    <img class="card-img-top" src="${product.img}" alt="Card image cap">
    <p style="color: gray; margin: 15px;">${category.Name}</p>
    <div class="card-body">
      <p class="card-text" style="font-weight: bold;">${product.desc}</p>
      <i style="color:gold" class="fa-solid fa-star"></i>
      <i  style="color:gold" class="fa-solid fa-star"></i>
      <i  style="color:gold" class="fa-solid fa-star"></i>
      <i  style="color:gold" class="fa-solid fa-star"></i>
      <i   style="color:gold"class="fa-regular fa-star"></i>
      <p style="font-size: 15px;">By <span style="color: green;"> ${product.company}</span></p>
      <div style="display: flex; justify-content: space-between;">
        <p style="font-weight: bold; color:gray;"><span style="color: #3BB77E; font-size: 20px;">$${product.price}</span>   $${product.oldPrice}</p>
        <button class="btn btn-success"><i class="fa-solid fa-cart-shopping"></i> Add</button></div>
      
    </div>
  </div>
     `
  })
}
selection.addEventListener("change", function(e){
  e.preventDefault();
  if(this.value=="slider"){
    window.location.href = './slider.html';
  }
  else if(this.value=="category"){
    window.location.href = './categories.html';
  }
  else if(this.value=="product"){
    window.location.href = './products.html';
  }
})
