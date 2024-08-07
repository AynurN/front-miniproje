const URL="http://localhost:3003/categories";
let table=document.getElementById("table");
let createForm=document.getElementById("createCat")
let updateForm=document.getElementById("updateCat")
document.addEventListener("DOMContentLoaded", function(){
    fetch(URL)
    .then(response=>response.json())
    .then(datas=>{
        datas.forEach(element => {
            table.innerHTML+=`
            <tr>
                   <td>${element.id}</td>
                   <td><img src="${element.img}"></td>
                   <td>${element.Name}</td>
                   <td><a href="${URL + "/" +element.id}" data-bs-target="#updateModal" data-bs-toggle="modal" class="update btn btn-success">Update</a> 
                   <a href=${URL + "/" +element.id} class="delete btn btn-danger">Delete</a> </td>
                </tr>
            `
            document.querySelectorAll(".delete").forEach(btn=>
                {
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
                              const response= await fetch(e.target.href,{
                                method:"DELETE"
                            })
                            if(response.ok){
                                alert("Deleted");
                            }
                            else{
                                alert("Error");
                            }
                            }
                          });
                       
                    })
                }
            )
            document.querySelectorAll(".update").forEach(btn=>
                {
                    btn.addEventListener("click", async function(e){
                        const catResponse=await fetch(e.target.href);
                        if(catResponse.ok){
                            const category=await catResponse.json();
                            Array.from(updateForm.elements).forEach(
                                element=>{
                                    if(element.name){
                                        element.value=category[element.name]
                                    }
                                }
                            )
                        }
                        
                    })
                })
        });
    });
   
})
createForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cat = Object.fromEntries(formData.entries());
    cat.products = []; 
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cat)
    });
    if (response.ok) {
        alert("Succeeded");
        window.location.reload();
    } else {
        alert("Error");
    }
});
updateForm.addEventListener("submit", async function(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const cat = Object.fromEntries(formData.entries());
    cat.products = []; 
    const response = await fetch(URL+"/"+cat.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cat)
    });
    if (response.ok) {
        alert("Succeeded");
        window.location.reload();
    } else {
        alert("Error");
    }
})