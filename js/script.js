/**
 * Arbetsprov för Webbutvecklare Contribe
 *
 * @author Mats Magnusson 2018-05-27
 * @version 1.1.0
 */

'use strict'

/**
 * Funktion removeChild som kollar om det finns något i elementet och om det finns tar bort det.
 * @param {*} value
 */
function removeChild(value) {
    while (value.firstChild) {
        value.removeChild(value.firstChild)
    }
}

/**
 * Eventlyssnare som skapar en text och sedan element där vi skickar in bilderna efter en sökning på flickr
 */
// const results = document.querySelector('#results')
const divResults = document.querySelector('#divResults')
let form = document.querySelector('#sbx')

form.addEventListener('submit', event => {
        // console.log('Saving value', form.elements.search.value)
        let search = form.elements.search.value
        removeChild(divResults)
        let div = document.createElement('div')
        div.setAttribute('id', 'results')
        divResults.appendChild(div)
        let p = document.createElement('p')
        let t = document.createTextNode('Click on a picture to add to your gallery')
        p.appendChild(t)
        div.appendChild(p)
        flickrApi(search).then((images) => {
            images.map((img) => {
                let a = document.createElement('a')
                a.setAttribute('target', '_blank')
                a.href = img.src
                let b = img.appendChild(a)
                div.appendChild(img)
                divResults.scrollIntoView()
            })
        })
        event.preventDefault()
    })
    /**
     * Funktion handleErrors som tar hand om eventuella errors och kastar ett error meddelande
     * @param {*} response
     */
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return response
}

/**
 *
 * Funktion flickrApi som gör en get till flickrs api och sätter ihop svaret till en url länk till bilder
 * @param {*} tags
 */
let flickrApi = (tags) => {
    let apiUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d7bd4ee1b1cf2f0882e2c93021e51721&tags=${tags}&format=json&nojsoncallback=1`
    return fetch(apiUrl)
        .then(handleErrors)
        .then((resp) => resp.json())
        .then((data) => {
            let images = []
            data.photos.photo.map((i, index) => {
                // console.log(i.farm)
                let url = 'http://farm' + i.farm + '.static.flickr.com/' + i.server + '/' + i.id + '_' + i.secret + '.jpg'
                let img = document.createElement('img')
                img.setAttribute('id', index)
                img.setAttribute('alt', i.title)
                img.src = url
                images.push(img)
            })
            return images
        })
}

/**
 * Skapar en variabel gallery som om det finns hämtar innehållet från local storage och sparar det i en array
 */
let gallery = localStorage.getItem('links') ? JSON.parse(localStorage.getItem('links')) : []
    // const data = JSON.parse(localStorage.getItem('links'))

/**
 * Skapar en lyssnare som om man klickar på en bild efter sökning på flickr lagras i local storage
 */
// let sel = document.querySelector('#results')
divResults.addEventListener('click', (e) => {
    let pic = e.target.getAttribute('src')
    gallery.push(pic)
    localStorage.setItem('links', JSON.stringify(gallery))
        // console.log('Added pic:', e.target.getAttribute('src'))
})

/**
 * Funktion galleryImg som loopar igenom galleriet och skickar in dem i en div för att visas på sidan
 */
let selGallery = document.querySelector('#gallery')
let galleryImg = gallery.map((url) => {
    let img = document.createElement('img')
    img.src = url
    selGallery.appendChild(img)
})

/**
 * Skapar en lyssnare som om man klickar på en bild i galleriet så visas den i ett större format i en ny div
 */
let textGallery = document.querySelector('#text')
let large = document.querySelector('#large')
selGallery.addEventListener('click', (e) => {
    removeChild(large)
    let img = document.createElement('img')
    let url = e.target.getAttribute('src')
    img.src = url
    large.appendChild(img)
    removeChild(textGallery)
    let p = document.createElement('p')
    let t = document.createTextNode('Click on large image to remove')
    p.appendChild(t)
    textGallery.appendChild(p)
    large.scrollIntoView()
})

/**
 * En lyssnare som visar galleriet om man klickar på view gallery
 */
let viewGalleryButton = document.querySelector('#viewGalleryButton')
viewGalleryButton.addEventListener('click', (e) => {
    if (selGallery.style.display === 'none') {
        selGallery.style.display = 'block'
        selGallery.scrollIntoView()
    } else {
        selGallery.style.display = 'none'
    }
})

/**
 * Lyssnare som tar bort den större bilden om man klickar på den
 */
large.addEventListener('click', () => {
    let item = document.querySelector('#large img')
        // console.log('Remove item: ', item)
    item.remove()
        // textGallery.remove()
    removeChild(textGallery)
})

/**
 * En lyssnare som tömmer localstorage om man klickar på remove knappen
 */
let emptyGallery = document.querySelector('#removeButton')
emptyGallery.addEventListener('click', (e) => {
    localStorage.clear()
})