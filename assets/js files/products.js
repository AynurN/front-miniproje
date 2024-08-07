const productList = document.getElementById('productList');
const createProductForm = document.getElementById('createPro');
const updateProductForm = document.getElementById('updatePro');
const categorySelect = document.getElementById("cat");
const categorySelect2 = document.getElementById("cate");
const URL = "http://localhost:3003/categories";

document.addEventListener('DOMContentLoaded', function () {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            newCategories(data);
            renderProducts(data);
        });
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
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.id}</td>
                <td>${category.Name}</td>
                <td><img src="${product.img}" alt="${product.desc}" style="width: 50px; height: 50px;"></td>
                <td>${product.desc}</td>
                <td>${product.company}</td>
                <td>${product.price}</td>
                <td>${product.oldPrice}</td>
                <td>
                    <a href="#" data-category-id="${category.id}" data-product-id="${product.id}" class="update btn btn-success" data-bs-target="#updateModal" data-bs-toggle="modal">Update</a> 
                    <a href="#" data-category-id="${category.id}" data-product-id="${product.id}" class="delete btn btn-danger">Delete</a> 
                </td>
            `;
            productList.appendChild(tr);
        });

        document.querySelectorAll(".delete").forEach(btn => {
            btn.addEventListener("click", async function(e) {
                e.preventDefault();

                const categoryId = e.target.getAttribute('data-category-id');
                const productId = e.target.getAttribute('data-product-id');
                const category = categories.find(cat => cat.id == categoryId);

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
                        if (category) {
                            category.products = category.products.filter(prod => prod.id != productId);

                            const updateResponse = await fetch(`${URL}/${category.id}`, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(category)
                            });

                            if (updateResponse.ok) {
                                await Swal.fire({
                                    title: "Deleted!",
                                    text: "The product has been deleted.",
                                    icon: "success"
                                });
                                renderProducts(categories);
                            } else {
                                await Swal.fire({
                                    title: "Error",
                                    text: "Failed to delete the product.",
                                    icon: "error"
                                });
                            }
                        } else {
                            console.error('Category not found');
                        }
                    }
                });
            });
        });

        document.querySelectorAll(".update").forEach(btn => {
            btn.addEventListener("click", async function(e) {
                e.preventDefault();

                const categoryId = e.target.getAttribute('data-category-id');
                const productId = e.target.getAttribute('data-product-id');

                try {
                    const catResponse = await fetch(`${URL}/${categoryId}`);
                    if (catResponse.ok) {
                        const category = await catResponse.json();
                        const product = category.products.find(prod => parseInt(prod.id) == productId);
                        categorySelect2.innerHTML+='';
                        if (product) {
                            Array.from(updateProductForm.elements).forEach(element => {
                                if (element.name) {
                                    element.value = product[element.name] || '';
                                }
                        
                            });
                            categorySelect2.innerHTML+=`
                                <option value="${category.Name}">${category.Name}</option>
                                `
                           
                        }
                    }
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            });
        });
    });
}

createProductForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newProduct = {
        id: formData.get('id'),
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

            const updateResponse = await fetch(`${URL}/${category.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(category)
            });

            if (updateResponse.ok) {
                alert("Product added successfully");
                renderProducts(categories);
            } 
        } 
    } catch (error) {
        console.error('Error:', error);
    }
});

updateProductForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productId = formData.get('id');
    const categoryName = formData.get('category'); 

    try {
        const response = await fetch(URL);
        const categories = await response.json();
        const category = categories.find(cat => cat.Name == categoryName);
        if (!category) {
            throw new Error('Category not found');
        }

        const categoryId = category.id;

        const catResponse = await fetch(`${URL}/${categoryId}`);
        if (!catResponse.ok) {
            throw new Error('Failed to fetch category');
        }

        const categoryData = await catResponse.json();
        const productIndex = categoryData.products.findIndex(prod => prod.id == productId);

        if (productIndex != -1) {
            categoryData.products[productIndex].img = formData.get('img');
            categoryData.products[productIndex].desc = formData.get('desc');
            categoryData.products[productIndex].company = formData.get('company');
            categoryData.products[productIndex].price = formData.get('price');
            categoryData.products[productIndex].oldPrice = formData.get('oldPrice');

            const updateResponse = await fetch(`${URL}/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(categoryData)
            });

            if (updateResponse.ok) {
                alert("Product updated successfully");
                window.location.reload(); 
            } else {
                throw new Error('Failed to update product');
            }
        } else {
            throw new Error('Product not found in category');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        alert("Error updating product");
    }
});
