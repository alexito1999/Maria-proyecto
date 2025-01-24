
const options = {
    root: null,
    roootMargin: "0px",
    threshold: 0
}
const observer = new IntersectionObserver(
    callback,
    options
)
observer.observe(element)