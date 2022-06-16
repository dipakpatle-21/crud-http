let cl = console.log;

let baseUrl ='https://jsonplaceholder.typicode.com/posts';

const data =document.getElementById("data");
const postsForm =document.getElementById("postsForm");
const title =document.getElementById("title");
const info =document.getElementById("info");
const submitbtn =document.getElementById("submitbtn");
const updatebtn =document.getElementById("updatebtn");

let postArray =[];

function makeHttpRequest(method,url,body){
  return new Promise((resolve,reject)=>{
    let xhr = new XMLHttpRequest();
     xhr.open(method,url,true)
     xhr.onload = function(){
      if((xhr.status ===200 || xhr.status ===201) && xhr.readyState === 4){
        resolve(xhr.response)
      }else{
        reject('Something Went Wrong')
      }
    };
    xhr.send(body);
  })
}

makeHttpRequest('GET',baseUrl)
.then(res=>{
  postArray= JSON.parse(res);
  templating(postArray);
})
// .then(res=>templating(JSON.parse(res));
// .then(templating)
// .catch(err=>cl(err));
.catch(cl);
const onEditHandler = (ele) =>{
  // cl(ele);
  let getId = +ele.getAttribute("data-id")
  localStorage.setItem('setId',getId);
  // cl(getId)
  let getObj = postArray.filter((obj) =>{
    return obj.id === getId;
  })
    // cl(getObj);
// };
  // let getObj = postArray.find((obj) =>{
  //   return obj.id === getId;
  // })
    cl(getObj);
    title.value = getObj[0].title;
    info.value = getObj[0].body;
    submitbtn.classList.add('d-none');
    updatebtn.classList.remove('d-none');
};
const onDeleteHandler = (ele) =>{
  let getId =ele.getAttribute("data-id")
  cl(getId)
  let deleteUrl =`${baseUrl}/${getId}`; 
  // cl(deleteUrl)
  let updateData = postArray.filter(obj=>{
    return obj.id != getId
  })
  templating(updateData)
  makeHttpRequest('DELETE',deleteUrl)
};

function templating(arr){
  // arr = JSON.parse(arr);
  let result ="";
  arr.forEach(ele => {
    result +=`
      <div class="card mb-4">
        <div class="card-body">
          <h3>${ele.title}</h3>
          <p>${ele.body}</p>
          <p class="text-right">
          <button class="btn btn-success" data-id="${ele.id}" onclick="onEditHandler(this)">Edit</button>
          <button class="btn btn-danger" data-id="${ele.id}" onclick="onDeleteHandler(this)">Delete</button>
          </p>
        </div>
      </div>
    `;
  });
  data.innerHTML= result;
}
const onupdateHandler = (eve) =>{
  let obj={
    title : title.value,
    body : info.value,
  };
  let updateId = +localStorage.getItem('setId');   
  cl(obj,updateId)
    postArray.forEach(ele=>{
      if(ele.id === updateId){
        ele.title = title.value,
        ele.body = info.value
      }
    })
    templating(postArray);
  let updateUrl =`${baseUrl}/${updateId}`;
    updatebtn.classList.add('d-none');
    submitbtn.classList.remove('d-none');
    postArray.reset();
  makeHttpRequest('PATCH',updateUrl,JSON.stringify(obj))
}
let onPostHandler = (eve) =>{
  eve.preventDefault();
  let obj={
    title : title.value,
    body : info.value,
    userId:Math.ceil(Math.random()*10),
  };
  postArray.push(obj);
  cl(obj);
  templating(postArray);
  makeHttpRequest("POST",baseUrl,JSON.stringify(obj))
  postsForm.reset();
};

updatebtn.addEventListener('click',onupdateHandler)
postsForm.addEventListener('submit',onPostHandler)