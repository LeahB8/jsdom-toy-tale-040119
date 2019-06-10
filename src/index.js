const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const actualToyForm = document.querySelector('.add-toy-form')
let addToy = false

// YOUR CODE HERE

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

//------------- initialise function -------------------//

const init = () =>
  fetchToys().then(renderToys)


//------------- server side -------------------//

const toys_url = 'http://localhost:3000/toys'

const fetchToys = () =>
  fetch(toys_url).then(resp => resp.json())


const createToyOnServer = toy => {
  return fetch(toys_url, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: toy.name,
      image: toy.image,
      likes: 0
    })
  }).then(resp => resp.json())
}

const increaseLikesOnServer = toy => {
  toy.likes++
  return fetch(toys_url + `/${toy.id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: toy.likes
    })
  }).then(resp => resp.json())
}

const deleteToyOnServer = toy => {
  return fetch(toys_url + `/${toy.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
  }).then(resp => resp.json())
}


//------------- client side -------------------//

const toyDiv = document.querySelector('#toy-collection')
const nameInput = document.querySelector('#name-input')
const imageInput = document.querySelector('#image-input')



const renderToys = toys => {
  toyDiv.innerHTML = ``
  toys.forEach(toy => renderToy(toy))
}

const renderToy = toy => {
  const toyCard = document.createElement('div')
  toyCard.className = 'card'

  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p>${toy.likes} Likes </p>
    <button class="like-btn">Like <3</button>
    <button class="delete-btn">X</button>


  `
  toyDiv.append(toyCard)

  toyCard.querySelector('.like-btn').addEventListener('click', () => {
    increaseLikesOnServer(toy)
      .then(toyCard.querySelector('p').innerHTML = `${toy.likes} Likes`)
  })

  toyCard.querySelector('.delete-btn').addEventListener('click', () => {
    deleteToyOnServer(toy)
      .then(toyCard.remove())
  })

}

actualToyForm.addEventListener('submit', (event) => {
  event.preventDefault()
  let toy = {
    name: nameInput.value,
    image: imageInput.value,
    likes: 0
  }
  createToyOnServer(toy)
    .then(() => {
      renderToy(toy)
      actualToyForm.reset()
    })

  
})



//------------- calling initialise function -------------------//

init()