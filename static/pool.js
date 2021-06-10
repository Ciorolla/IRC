console.log("siema")
let nickname = prompt("podaj nick")
let flag = true
let color = Math.floor(Math.random() * 16777215).toString(16);
let $scrollbar = $("#scrollbar1")
$scrollbar.tinyscrollbar()
let $scrollbarData = $scrollbar.data("plugin_tinyscrollbar")

// import { checkText } from 'https://cdn.skypack.dev/smile2emoji'
// const manageInput = (e) => {
//     e.target.value = checkText(e.target.value);
// };

// let input = document.getElementById("input");
// input.addEventListener("keyup", manageInput);

let subscribe = function (url, cb) {
    $.ajax({
        method: 'GET',
        url: url,
        success: function (data) {
            cb(data);
        },
        complete: function () {
            setTimeout(function () {
                subscribe(url, cb);
            }, 300);
        },
        timeout: 3000
    });
};

subscribe("/poll", function (data) {

    let par = document.createElement("p")
    par.classList.add("emo")
    if (data.system == 1) {
        par.innerText = `SYSTEM: użytkownik ${data.nick} ${data.text} `
    }
    else {
        par.innerHTML = `<a style = "color:#${data.color}" class="dupa">${data.nick}:</a> ${data.text}`
    }
    console.log(data.color)
    document.getElementById("chat").appendChild(par)
    $('.emo').emoticonize()
    $('.dupa').unemoticonize()
    console.log("Data:", data);
    $scrollbarData.update("bottom");
});

document.getElementById("send").addEventListener("click", function () {
    if (document.getElementById("input").value == "/help") {
        let par = document.createElement("p")
        par.innerText = `SYSTEM: dostępne polecenia systemowe to /help /cls /color`
        document.getElementById("chat").appendChild(par)
    }
    else if (document.getElementById("input").value == "/cls") {
        document.getElementById("chat").innerHTML = ""
    }
    else if (document.getElementById("input").value == "/color") {
        color = Math.floor(Math.random() * 16777215).toString(16);
        const bd = JSON.stringify({ system: 1, text: "zmienił nazwę swojego koloru !!", nick: nickname, color: color })
        fetch("/send", { method: "post", body: bd })
            .then(response => response.json())
            .then(response => {
                console.log("end")
            }
            )
    }
    else {

        const bd = JSON.stringify({ system: "", text: document.getElementById("input").value, nick: nickname, color: color })
        fetch("/send", { method: "post", body: bd })
            .then(response => response.json())
            .then(response => {
                console.log("end")
            }
            )
    }





});