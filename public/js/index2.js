if ($("body#home").length > 0) {
    //used to input currect url to refer input 
    var address = window.location.href
    const refer = document.querySelector(".refer")
    refer.value = address

    //used to add and remove invisible
    const registerButton = document.querySelector(".register")
    const loginButton = document.querySelector(".login")
    const registerFormSection = document.querySelector("#register-form")
    const loginFormSection = document.querySelector("#login-form")
    const headerDiv = document.querySelector(".header-div")

    const registerButtonHandler = () => {
        headerDiv.classList.add("invisible")
        registerFormSection.classList.remove("invisible");
    }
    const loginButtonHandler = () => {
        headerDiv.classList.add("invisible")
        loginFormSection.classList.remove("invisible");
    }

    registerButton.addEventListener("click", registerButtonHandler)
    loginButton.addEventListener("click", loginButtonHandler)

    //used to send alert to non-registerd member upon clicking navbar
    // const navFirstButton = document.querySelector(".btn-1")
    const navSecondButton = document.querySelector(".btn-2")
    const navThirdButton = document.querySelector(".btn-3")
    const navFourthButton = document.querySelector(".btn-4")
    const navFifthButton = document.querySelector(".btn-5")


    // const navFirstButtonHandler = () => {  
    //     console.log("i got clicked");
    //     alert("This section is not accessible without subscription")  
    // }
    const navSecondButtonHandler = () => {
        alert("This section is not accessible without subscription")
    }
    const navThirdButtonHandler = () => {
        alert("This section is not accessible without registration")
    }
    const navFourthButtonHandler = () => {
        alert("This section is not accessible without subscription")
    }
    const navFifthButtonHandler = () => {
        alert("This section is not accessible without subscription")
    }

    // navFirstButton.addEventListener("click", navFirstButtonHandler)
    navSecondButton.addEventListener("click", navSecondButtonHandler)
    navThirdButton.addEventListener("click", navThirdButtonHandler)
    navFourthButton.addEventListener("click", navFourthButtonHandler)
    navFifthButton.addEventListener("click", navFifthButtonHandler)

    function onChange() {
        const password = document.querySelector('input[name=password]');
        const confirm = document.querySelector('input[name=confirm]');
        if (confirm.value === password.value) {
            confirm.setCustomValidity('');
        } else {
            confirm.setCustomValidity('Passwords do not match');
        }
    }
}



if ($("body#about-us-home").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }

    //used to send alert to non-registerd member upon clicking navbar
    // const navFirstButton = document.querySelector(".btn-1")
    const navSecondButton = document.querySelector(".btn-2")
    const navThirdButton = document.querySelector(".btn-3")
    const navFourthButton = document.querySelector(".btn-4")
    const navFifthButton = document.querySelector(".btn-5")


    // const navFirstButtonHandler = () => {  
    //     console.log("i got clicked");
    //     alert("This section is not accessible without subscription")  
    // }
    const navSecondButtonHandler = () => {
        alert("This section is not accessible without subscription")
    }
    const navThirdButtonHandler = () => {
        alert("This section is not accessible without registration")
    }
    const navFourthButtonHandler = () => {
        alert("This section is not accessible without subscription")
    }
    const navFifthButtonHandler = () => {
        alert("This section is not accessible without subscription")
    }

    // navFirstButton.addEventListener("click", navFirstButtonHandler)
    navSecondButton.addEventListener("click", navSecondButtonHandler)
    navThirdButton.addEventListener("click", navThirdButtonHandler)
    navFourthButton.addEventListener("click", navFourthButtonHandler)
    navFifthButton.addEventListener("click", navFifthButtonHandler)
}




if ($("body#screen-flickering").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }

    const firstScreenFlickButton = document.querySelector(".btn-screen-flick1")
    const secondScreenFlickButton = document.querySelector(".btn-screen-flick2")
    const thirdScreenFlickButton = document.querySelector(".btn-screen-flick3")

    const firstPreviousButton = document.querySelector(".btn-previous1")

    const firstDiv = document.querySelector(".d-screen-flick1")
    const secondDiv = document.querySelector(".d-screen-flick2")
    const thirdDiv = document.querySelector(".d-screen-flick3")
    const fourthDiv = document.querySelector(".d-screen-flick4")

    function remove() {
        firstDiv.classList.add("invisible");
        secondDiv.classList.add("invisible");
        thirdDiv.classList.add("invisible");
        fourthDiv.classList.add("invisible");
    }

    const firstScreenFlickButtonHandler = () => {
        remove();
        secondDiv.classList.remove("invisible")
    }
    const secondScreenFlickButtonHandler = () => {
        remove();
        thirdDiv.classList.remove("invisible")
    }
    const thirdScreenFlickButtonHandler = () => {
        remove()
        fourthDiv.classList.remove("invisible")
    }


    const firstPreviousButtonHandler = () => {
        remove();
        thirdDiv.classList.remove("invisible")
    }


    firstScreenFlickButton.addEventListener("click", firstScreenFlickButtonHandler)
    secondScreenFlickButton.addEventListener("click", secondScreenFlickButtonHandler)
    thirdScreenFlickButton.addEventListener("click", thirdScreenFlickButtonHandler)

    firstPreviousButton.addEventListener("click", firstPreviousButtonHandler)

}


if ($("body#flick-with-batt").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }

    const firstFlickWithBattButton = document.querySelector(".btn-flick-with-batt1")

    const firstDiv = document.querySelector(".d-flick-with-batt1")
    const secondDiv = document.querySelector(".d-flick-with-batt2")

    function remove() {
        firstDiv.classList.add("invisible");
        secondDiv.classList.add("invisible");
    }

    const firstFlickWithBattButtonHandler = () => {
        remove();
        secondDiv.classList.remove("invisible")
    }
    firstFlickWithBattButton.addEventListener("click", firstFlickWithBattButtonHandler)
}

if ($("body#ex-disp-no-int-disp").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }

    const firstExDispButton = document.querySelector(".btn-ex-disp1")
    const secondExDispButton = document.querySelector(".btn-ex-disp2")

    const firstDiv = document.querySelector(".d-ex-disp1")
    const secondDiv = document.querySelector(".d-ex-disp2")
    const thirdDiv = document.querySelector(".d-ex-disp3")

    function remove() {
        firstDiv.classList.add("invisible");
        secondDiv.classList.add("invisible");
        thirdDiv.classList.add("invisible");
    }

    const firstExDispButtonHandler = () => {
        remove();
        secondDiv.classList.remove("invisible")
    }
    const secondExDispButtonHandler = () => {
        remove();
        thirdDiv.classList.remove("invisible")
    }

    firstExDispButton.addEventListener("click", firstExDispButtonHandler)
    secondExDispButton.addEventListener("click", secondExDispButtonHandler)
}

if ($("body#stable-without-ram").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }

    const firstWithoutButton = document.querySelector(".btn-without1")
    const secondWithoutButton = document.querySelector(".btn-without2")
    const thirdWithoutButton = document.querySelector(".btn-without3")

    const firstPreviousButton = document.querySelector(".btn-previous1")

    const firstDiv = document.querySelector(".d-without1")
    const secondDiv = document.querySelector(".d-without2")
    const thirdDiv = document.querySelector(".d-without3")
    const fourthDiv = document.querySelector(".d-without4")

    function remove() {
        firstDiv.classList.add("invisible");
        secondDiv.classList.add("invisible");
        thirdDiv.classList.add("invisible");
        fourthDiv.classList.add("invisible");
    }

    const firstWithoutButtonHandler = () => {
        remove();
        secondDiv.classList.remove("invisible")
    }
    const secondWithoutButtonHandler = () => {
        remove();
        thirdDiv.classList.remove("invisible")
    }
    const thirdWithoutButtonHandler = () => {
        remove()
        fourthDiv.classList.remove("invisible")
    }

    const firstPreviousButtonHandler = () => {
        remove();
        secondDiv.classList.remove("invisible")
    }


    firstWithoutButton.addEventListener("click", firstWithoutButtonHandler)
    secondWithoutButton.addEventListener("click", secondWithoutButtonHandler)
    thirdWithoutButton.addEventListener("click", thirdWithoutButtonHandler)
    firstPreviousButton.addEventListener("click", firstPreviousButtonHandler)
}



if ($("body#component-heating").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}

if ($("body#fan-not-spinning").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}

if ($("body#flickering-display").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}

if ($("body#late-display").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#mb-issue").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#no-lvds-with-battery").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#pwr-with-adapter").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#pwr-with-battery").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#ram-requirement").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#restarting").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#short-in-dc-dc").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#short-in-pwm-coil").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}

if ($("body#short-on-19v-rail").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#short").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}

if ($("body#stock-at-logo").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}

if ($("body#token-capacitor").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
if ($("body#white-screen").length > 0) {
    //bug route
    function bugRoute() {
        var location = window.location.href;
        document.forms[0].route.value = location;
    }
}
