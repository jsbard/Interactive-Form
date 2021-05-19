"use strict";
(function () {

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const otherJobInput = document.getElementById("other-job-role");
    const title = document.getElementById("title");
    const shirtColorSelect = document.getElementById("color");
    const shirtColorOptions = shirtColorSelect.children;
    const designSelect = document.getElementById("design");
    const activities = document.getElementById("activities");
    const activityChkBoxes = document.querySelectorAll("#activities input");
    const activitiesCost = document.getElementById("activities-cost");
    const userPayment = document.getElementById("payment");
    const cardNum = document.getElementById("cc-num");
    const zip = document.getElementById("zip");
    const cvv = document.getElementById("cvv");

    const hideElement = (element) => {
        element.style.display = "none";
    }

    const showElement = (element) => {
        element.style.display = "block";
    }

    const makeValid = (element) => {
        element.classList.remove("not-valid");
        element.classList.add("valid");
        element.lastElementChild.style.display = "none";
    }

    const makeInvalid = (element) => {
        element.classList.add("not-valid");
        element.lastElementChild.style.display = "block";
    }
    const validateName = () => {
        return name.value !== "";
    }

    const validateEmail = () => {
        // Show custom email hint depending on type of error thrown
        // Regex provided from https://www.w3resource.com/javascript/form/email-validation.php
        // Tweaked to force tld
        const emailHint = document.getElementById("email-hint");
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
        if (email.value === ""){
            emailHint.textContent = "Email address cannot be blank";
            return false;
        } else {
            emailHint.textContent = "Email address must be formatted correctly";
            return (regex.test(email.value));
        }
    }

    const validateActivities = () => {
        const activityBox = document.getElementById("activities-box");
        const chkBoxes = activityBox.getElementsByTagName("input");
        let isChecked = false;

        for (let i=0; i<chkBoxes.length; i++){
            if (chkBoxes[i].checked){
                isChecked = true;
                break;
            }
        }

        return isChecked;
    }

    const validateCardNum = () => {
        const cardNumRegex = /^[0-9]{13,16}$/;
        return cardNumRegex.test(cardNum.value);
    }
    const validateZip = () => {
        const zipRegex = /^[0-9]{5}$/;
        return zipRegex.test(zip.value);
    }
    const validateCvv = () => {
        const cvvRegex = /^[0-9]{3}$/;
        return cvvRegex.test(cvv.value);
    }

    const validateCardInfo = () => {
        if (userPayment.value === "credit-card") {
            return validateCardNum() && validateZip() && validateCvv();
        } else {
            return true;
        }
    }


    /** Focus first text field on page load **/
    document.querySelector("form input").focus();

    /** Hide "other job role" text input unless selected **/
    otherJobInput.style.display = "none";

    title.addEventListener("change", e => {
       e.target.value === "other" ? showElement(otherJobInput): hideElement(otherJobInput);
    });

    /** Handle t-shirt colors based on type of t-shirt selected **/

    shirtColorSelect.disabled = true;

    designSelect.addEventListener("change", (e) => {
        // Enable and update color selections once design is picked
        shirtColorSelect.disabled = false;

        const selectedDesign = e.target;
        if (selectedDesign.value === "js puns"){
            for (let i=0; i<shirtColorOptions.length; i++){
                shirtColorOptions[i].removeAttribute("selected");
                shirtColorOptions[i].getAttribute("data-theme") === "js puns" ? showElement(shirtColorOptions[i]) : hideElement(shirtColorOptions[i]);
                shirtColorOptions[0].setAttribute("selected", "true");
            }
        }

        if (selectedDesign.value === "heart js"){
            for (let i=0; i<shirtColorOptions.length; i++){
                shirtColorOptions[i].removeAttribute("selected");
                shirtColorOptions[i].getAttribute("data-theme") === "heart js" ? showElement(shirtColorOptions[i]) : hideElement(shirtColorOptions[i]);
                shirtColorOptions[0].setAttribute("selected", "true");
            }
        }
    });

    /** Calculate event price based on selected activities **/
    /** Disable activities with time conflict **/

    // Calculate and display event price
    activities.addEventListener("click", (e) => {
        let total = 0;
        for (let i=0; i<activityChkBoxes.length; i++) {
            if (activityChkBoxes[i].checked){
                let activityPrice = activityChkBoxes[i].getAttribute("data-cost");
                total += parseInt(activityPrice);
           }
        }
        activitiesCost.innerHTML = `Total: $${total}`;

        // Disable activities with conflicting times
        const activityDayAndTime = e.target.getAttribute("data-day-and-time");
        const disableConflictingActivities = () => {
            for (let i = 0; i < activityChkBoxes.length; i++) {
                let checkbox = activityChkBoxes[i];
                if (checkbox.getAttribute("data-day-and-time") === activityDayAndTime && e.target !== checkbox) {
                    checkbox.disabled = true;
                    checkbox.parentElement.classList.add("disabled");
                }
            }
        }

        // Enable activities with conflicting times
        const enableConflictingActivities = () => {
            for (let i = 0; i < activityChkBoxes.length; i++) {
                let checkbox = activityChkBoxes[i];
                if (checkbox.getAttribute("data-day-and-time") === activityDayAndTime && e.target !== checkbox) {
                    checkbox.disabled = false;
                    checkbox.parentElement.classList.remove("disabled");
                }
            }
        }

        if (e.target.checked){
            disableConflictingActivities();
        } else {
            enableConflictingActivities();
        }


    });

    /** Update payment section based on preferred payment method **/

    const updatePaymentMethod = (payment) => {
        const paymentDivs = document.getElementsByClassName("payment-methods")[0].children;
        userPayment.value = payment;
        for (let i=2; i<paymentDivs.length; i++){
            if (paymentDivs[i].getAttribute("id") === payment) {
                showElement(paymentDivs[i]);
            } else {
                hideElement(paymentDivs[i]);
            }
        }
    }

    // Initially selected payment option
    updatePaymentMethod("credit-card");

    userPayment.addEventListener("change", (e) => {
        updatePaymentMethod(e.target.value);
    });

    /** Form Submit Validation **/
    /** Input fields are also validated in real time **/
    const form = document.getElementsByTagName("form")[0];

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        validateName() ? makeValid(name.parentElement) : makeInvalid(name.parentElement);
        validateEmail() ? makeValid(email.parentElement) : makeInvalid(email.parentElement);
        validateActivities() ? makeValid(activities) : makeInvalid(activities);
        validateCardNum() ? makeValid(cardNum.parentElement) : makeInvalid(cardNum.parentElement);
        validateZip() ? makeValid(zip.parentElement) : makeInvalid(zip.parentElement);
        validateCvv() ? makeValid(cvv.parentElement) : makeInvalid(cvv.parentElement);
        // Prevent form submission if any required fields are invalid
        if (validateName() && validateEmail() && validateActivities() && validateCardInfo()){
            form.submit();
        }

    });

    /** Real Time Form Validation **/
    name.addEventListener("keyup", ()=> {
        validateName() ? makeValid(name.parentElement) : makeInvalid(name.parentElement);
    });
    email.addEventListener("keyup", ()=> {
        validateEmail() ? makeValid(email.parentElement) : makeInvalid(email.parentElement);
    });
    activities.addEventListener("click", ()=> {
        validateActivities() ? makeValid(activities) : makeInvalid(activities);
    });
    cardNum.addEventListener("keyup", ()=> {
        validateCardNum() ? makeValid(cardNum.parentElement) : makeInvalid(cardNum.parentElement);
    });
    zip.addEventListener("keyup", ()=> {
        validateZip() ? makeValid(zip.parentElement) : makeInvalid(zip.parentElement);
    });
    cvv.addEventListener("keyup", ()=> {
        validateCvv() ? makeValid(cvv.parentElement) : makeInvalid(cvv.parentElement);
    });

    /** Handle Checkbox Accessibility **/
    const checkBoxes = document.querySelectorAll("input[type='checkbox']");
    for (let i=0; i<checkBoxes.length; i++) {
        checkBoxes[i].addEventListener("focus", (e) => {
            let label = e.target.parentNode;
            label.className = "focus";
        });
        checkBoxes[i].addEventListener("blur", (e) => {
            let label = e.target.parentNode;
            label.className = "";
        });
    }

})();