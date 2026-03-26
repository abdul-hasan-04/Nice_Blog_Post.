// select All DOM Elements // => usefull before an events//
let addPost= document.querySelector("#addPost");
let posts_container = document.querySelector(".blogs-parent");
let postTitle = document.querySelector("#post-title");
let post_image = document.querySelector("#Image_url");
let postComm = document.querySelector("#post_comment");
let subTitle = document.querySelector(".sub-title");
let popup = document.querySelector(".popup");
let overlayContainer = document.querySelector(".overlay-container");
let trackInputErrors = null;
// render all data when user loads the website //
document.addEventListener("DOMContentLoaded", () => {
    let myLocalStorageData = readlocalstorage();
    myLocalStorageData.forEach(post => {
        addPostToDom(post);
    });
})

// addpost to localstorage //
// readlocalstorage//
const readlocalstorage = () => JSON.parse(localStorage.getItem("posts")) || [];

const addPostToLocalStorage = (post) => {
  let myPosts = readlocalstorage();
  myPosts.push(post);
  localStorage.setItem("posts", JSON.stringify(myPosts));
}

const implementEditTask  = (id,blogItem) => {
let upateBtn = popup.querySelector(".update-btn");
upateBtn.addEventListener("click", () => {
        overlayContainer.classList.remove("active");
        document.body.classList.remove("no-scroll");
        let editBtn = blogItem.querySelector(".edit-btn");
        subTitle.textContent = "Create New Blog";
        editBtn.disabled = false;
        // get values and update //
        let myoldLocalStorage = readlocalstorage();
        let updateBlog = myoldLocalStorage.find(post => post.postId === id);
        if(updateBlog) {
            let newTitle = popup.querySelector("#post-title");
            let newimage = popup.querySelector("#Image_url");
            let newcomment = popup.querySelector("#post_comment");
            updateBlog.postTitle = newTitle.value;
            updateBlog.postImage = newimage.value;
            updateBlog.postComment = newcomment.value;
        };
        localStorage.setItem("posts", JSON.stringify(myoldLocalStorage))
        myoldLocalStorage.forEach(post => {
            posts_container.innerHTML = "";
            addPostToDom(post);
        });
    });
}
// edit blog post //
const updateBlogPost = (id,blogItem) => {
    // create updateBtn and disable edit btn first//
    let newBtn = document.createElement("button");
    newBtn.textContent = "Update Post";
    newBtn.className = "btn update-btn";
    popup.append(newBtn);
    implementEditTask(id,blogItem);

}
const editBlogPost = (id,blogItem) => {
    let myLocalStorageData = readlocalstorage();
    let editedBlog = myLocalStorageData.find(blog => blog.postId === id);
    if(editedBlog){
        // give back the user value //
        overlayContainer.classList.add("active");
        document.body.classList.add("no-scroll");
        popup.innerHTML = `
        <input
          type="text"
          placeholder="Post Title"
          id="post-title"
          name="post-title"
        />
        <input
          type="text"
          placeholder="Image URL"
          id="Image_url"
          name="Image_url"
        />
        <textarea
          name="post-comment"
          id="post_comment"
          placeholder="Write your post here..."
        ></textarea>`;
        let newTitle = popup.querySelector("#post-title");
        let newimage = popup.querySelector("#Image_url");
        let newcomment = popup.querySelector("#post_comment");
        newTitle.value = editedBlog.postTitle;
        newimage.value = editedBlog.postImage;
        newcomment.value = editedBlog.postComment;
        // update dom and localStorage //
        updateBlogPost(id,blogItem);
    }
}
// deletePost and EditPost || functions.

const displayDeletedMessage = () => {
    let spanElement = document.createElement("div");
    let loaderSpan = document.createElement("div");
    let textSpan = document.createElement("p");
    textSpan.textContent = "Post Deleted. ✅";
    loaderSpan.className = "loader";
    spanElement.className ="message-span";
    spanElement.append(loaderSpan);
    spanElement.append(textSpan);
    document.body.append(spanElement);
    spanElement.classList.add("active")
}
const deleteBlogPost = (id) => {
    let myCurrentPostList = readlocalstorage();
    myCurrentPostList = myCurrentPostList.filter(post => post.postId !== id);
    localStorage.setItem("posts", JSON.stringify(myCurrentPostList));
    posts_container.innerHTML = "";
    myCurrentPostList.forEach(post => {
        addPostToDom(post);
    });
    let deltedMessagecontainer = document.querySelector(".message-span");
    deltedMessagecontainer.remove();
}
// events handling |edit,delete.
const eventHandling = (post, postitem) => {
    let editBtn = postitem.querySelector(".edit-btn");
    let deleteBtn = postitem.querySelector(".delete-btn");

    editBtn.addEventListener("click", () => {
        editBlogPost(post.postId,postitem);
        editBtn.disabled = true;
        subTitle.textContent = "Update Blog";
    });
    deleteBtn.addEventListener("click", () => {
        setTimeout(() => {
            deleteBlogPost(post.postId,postitem);
        }, 2000);
        displayDeletedMessage();
    });
}
// rendering dom elements || function

const renderDomElements = (elements) => {
    posts_container.append(elements);
}
// create function of adding post to dom//
const addPostToDom = (post) => {
    let postElementHolder = document.createElement("div");
    postElementHolder.className = "blog";
    postElementHolder.innerHTML = `
    <div class="blog-body">
            <h3 class="post-description">${post.postTitle}</h3>
            <span class="post-date"> ${post.currentDate}</span>
            <img src="${post.postImage}" alt="user's post image"/>
            <p class="post_info">${post.postComment}</p>
          </div>
          <div class="post_control">
            <button class="edit-btn btn">Edit Post</button>
            <button class="delete-btn btn">Delete Post</button>
          </div>`
    renderDomElements(postElementHolder);
    eventHandling(post,postElementHolder);
}
// createPost Function 
const createPost = () => {
    let postAddress = {
        postId : Date.now(),
        postTitle : postTitle.value,
        postImage : post_image.value,
        postComment : postComm.value,
        currentDate: new Date().toDateString()
    }
    addPostToDom(postAddress);
    addPostToLocalStorage(postAddress);
}

const showError = (input,message) => {
    input.classList.remove("success");
    input.classList.add("error");
    alert(`${message}`);
}
const showSuccess = (input) => {
    input.classList.remove("error");
    input.classList.add("success");
}
const check_PAss= () => {
    let postTitleInput = document.querySelector("#post-title").value.trim();
    let post_image_URl = document.querySelector("#Image_url").value.trim();
    let postComment = document.querySelector("#post_comment").value.trim();

    if(!postTitleInput){
        showError(postTitle, "Please, enter post title");
        trackInputErrors = "title";
        return;
    }else{
        showSuccess(postTitle);
    }
    if(!post_image_URl){
        showError(post_image, "Image URL is required.");
        trackInputErrors = "image";
        return;
    
    }else{
        showSuccess(post_image);
    }

    if(!postComment){
        showError(postComm, "Comment the post.");
        trackInputErrors = "comment";
        return;
        
    }else{
        showSuccess(postComm);
    };
    
    // focus the input which is having an error class //
    if(trackInputErrors === "title"){
        postTitle.focus();
    }
    
//    after checking create postaddress object using the users value.
    createPost();
    postTitle.value = "";
    post_image.value = "";
    postComm.value = "";
}
addPost.addEventListener("click", () => {
    check_PAss();
     if(trackInputErrors === "title"){
        postTitle.focus();
    }else if(trackInputErrors === "image"){
        post_image.focus();
    }else if(trackInputErrors === "comment"){
        postComm.focus();
    };
})




