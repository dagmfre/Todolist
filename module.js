let getDate = ()=> {
    let date = new Date();
    let option = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    }
    let today = date.toLocaleString("en-US", option)

    return(today)
}
exports.getDate = getDate;

let year = ()=> {
    let date = new Date();
    let option = {
        weekday: "long"
    }
    let today = date.toLocaleString("en-US", option)

    return(today)
}
exports.year = year;