function updateClock() {
    const now = new Date();

    //Time
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    //Format time (add leading zero)
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");    
    seconds = seconds.toString().padStart(2, "0");

    document.getElementById("time").textContent = `${hours}:${minutes}:${seconds}`;

    //Date
    const options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};

    const dateStr = now.toLocaleDateString("en-US", options);

    document.getElementById("date").textContent = dateStr;
}


//update every second
setInterval(updateClock, 1000) //1000 - 1seconds

//Run once at start
updateClock();