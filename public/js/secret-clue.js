//used to rename button and div
const randomCarousel = document.querySelector(".random-carousel")
const test = document.querySelector(".carousel-inner")

//button handler
const randomCarouselHandler = () => {
    randomCarousel.classList.add("invisible")
    console.log("i got clicked")
    test.classList.remove("invisible")
}

randomCarousel.addEventListener("click", randomCarouselHandler)