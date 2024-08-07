
const productList = document.getElementById('productList');
    const createProductForm = document.getElementById('createPro');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const categorySelect = document.getElementById("cat")
    const URL="http://localhost:3003/categories";

document.addEventListener('DOMContentLoaded', function () {
    
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            newCategories(data);
            renderProducts(data);
           
        })

  

    });
    function newCategories(categories) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.Name;
            option.textContent = category.Name;
            categorySelect.appendChild(option);
        });
    }
    
    function renderProducts(categories) {
        productList.innerHTML = '';

        categories.forEach(category => {
            category.products.forEach(product => {
                const tr= document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.id}</td>
                    <td>${category.Name}</td>
                    <td><img src="${product.img}" alt="${product.desc}" style="width: 50px; height: 50px;"></td>
                    <td>${product.desc}</td>
                    <td>${product.company}</td>
                    <td>${product.price}</td>
                    <td>${product.oldPrice}</td>
                    <td>
                    <a href="${URL + "/" +product.id}"id="${product.id}" data-bs-target="#updateModal" data-bs-toggle="modal" class="update btn btn-success">Update</a> 
                    <a href=${URL + "/" +category.id} id="${product.id}" class="delete btn btn-danger">Delete</a> 
                    </td>
                `;
                productList.appendChild(tr);
              document.querySelectorAll(".delete").forEach(btn=>{
                btn.addEventListener("click",function(e){
                     e.preventDefault();
                     Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!"
                      }).then(async(result) => {
                        if (result.isConfirmed) {
                          await Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                          });
                          const response=await fetch(e.target.href);
                        if(response.ok){
                            const cats=cat
                        }
                        if(response.ok){
                            alert("Deleted");
                        }
                        else{
                            alert("Error");
                        }
                        }
                      });
                } )
              })
                
                
            });
        });
    }
   
    createProductForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const newProduct = {
            id: formData.get('id'),
            category: formData.get('category'),
            img: formData.get('img'),
            desc: formData.get('desc'),
            company: formData.get('company'),
            price: formData.get('price'),
            oldPrice: formData.get('oldPrice')
        };
        
        try {
            const response = await fetch(URL);
            const categories = await response.json();
            const categoryName = formData.get('category');
            const category = categories.find(cat => cat.Name == categoryName);
            if (category) {
                category.products.push(newProduct);
    
                const updateResponse = await fetch(URL+"/"+category.id, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(category)
                });
    
                if (updateResponse.ok) {
                    alert("Product added successfully")
                } else {
                    console.error("Error");
                }
            } else {
                console.error('Category not found');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    