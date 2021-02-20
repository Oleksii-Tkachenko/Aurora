document.addEventListener("DOMContentLoaded", () => {
    
    // webp support

    function testWebP(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";

    }

    testWebP(function (support) {
        if (support == true) {
            document.querySelector('body').classList.add('webp');
        } else {
            document.querySelector('body').classList.add('no-webp');
        }

    });

    // Changing main background and sign in view on link cklick

    const loginLink = document.querySelector(".login__link_signin");
    const loginWrapper = document.querySelector(".login");
    const welcomeWrapper = document.querySelector(".welcome");
    const busket = document.querySelector(".login__link_basket");

    loginLink.onclick = function(e) {
        e.preventDefault();

        loginWrapper.classList.add("login_loggedin");
        welcomeWrapper.classList.add("welcome_loggedin");

        let userName = "Angels";  // user name

        let name = document.createElement("a");
        name.href = "#";
        name.classList.add("login__link");
        name.innerText = `Hi ${userName}!`;

        loginWrapper.insertBefore(name, busket);
    }

    // Changing main background on cklick

    document.addEventListener("click", (e) => {
        if (e.target.className === "container") {
            welcomeWrapper.classList.toggle("welcome_loggedin");
        }
    });
});

