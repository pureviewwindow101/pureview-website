/* EMAILJS CONFIG */
if (typeof emailjs !== "undefined") {
    emailjs.init({
        publicKey: "C1KD4n2MZ_l85nsN6"
    });
}
/* GALLERY LIGHTBOX */
const galleryImages = document.querySelectorAll(".gallery-grid img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox-close");
const prevBtn = document.querySelector(".lightbox-prev");
const nextBtn = document.querySelector(".lightbox-next");

if (galleryImages.length > 0 && lightbox && lightboxImg && closeBtn && prevBtn && nextBtn) {
    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightbox.classList.add("active");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
    }

    galleryImages.forEach((img, index) => {
        img.addEventListener("click", () => openLightbox(index));
    });

    closeBtn.addEventListener("click", closeLightbox);
    nextBtn.addEventListener("click", showNext);
    prevBtn.addEventListener("click", showPrev);

    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;

        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

/* VERIFY PROPERTY ADDRESS */
const verifyAddressBtn = document.getElementById("verifyAddressBtn");
const locationStatus = document.getElementById("locationStatus");
const mapsLinkInput = document.getElementById("mapsLink");
const streetInput = document.querySelector('input[name="street"]');

if (verifyAddressBtn && locationStatus && mapsLinkInput && streetInput) {
    verifyAddressBtn.addEventListener("click", () => {
        const propertyAddress = streetInput.value.trim();

        if (!propertyAddress) {
            locationStatus.textContent = "Please enter the property address before verifying it.";
            locationStatus.style.color = "#d9534f";
            return;
        }

        const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(propertyAddress)}`;

        mapsLinkInput.value = mapsLink;
        locationStatus.textContent = "Property address verified.";
        locationStatus.style.color = "#0ea98c";

        window.open(mapsLink, "_blank");
    });

    streetInput.addEventListener("input", () => {
        mapsLinkInput.value = "";
        locationStatus.textContent = "";
    });
}
/* FORM VALIDATION */
const estimateForm = document.querySelector(".estimate-form");
const formSummaryError = document.getElementById("formSummaryError");
const formSuccessMessage = document.getElementById("formSuccessMessage");
const successMessageText = document.getElementById("successMessageText");
const successOkBtn = document.getElementById("successOkBtn");
if (successOkBtn && formSuccessMessage) {

    successOkBtn.addEventListener("click", () => {

        formSuccessMessage.classList.remove("active");

    });

}

if (estimateForm && formSummaryError) {
    estimateForm.addEventListener("submit", (event) => {
        const errors = [];

        const nameInput = document.querySelector('input[name="name"]');
        const emailInput = document.querySelector('input[name="email"]');
        const phoneInput = document.querySelector('input[name="phone"]');
        const addressInput = document.querySelector('input[name="street"]');
        const descriptionInput = document.querySelector('textarea[name="description"]');



        const requiredFields = [
            { input: nameInput, label: "Full Name" },
            { input: addressInput, label: "Property Address" }
        ];
        document.querySelectorAll(".input-error").forEach((field) => {
            field.classList.remove("input-error");
        });

        requiredFields.forEach((field) => {
            if (field.input && field.input.value.trim() === "") {
                errors.push(field.label);
                field.input.classList.add("input-error");
            }
        });

        const selectedEstimateType = document.querySelector('input[name="estimate_type"]:checked');
        const isCommercial = selectedEstimateType && selectedEstimateType.value === "Commercial";

        const selectedServices = document.querySelectorAll('input[name="services"]:checked');
        const selectedFloors = document.querySelector('input[name="floors"]:checked');

        if (!isCommercial) {

            if (selectedServices.length === 0) {
                errors.push("Select at least one service");
            }

            if (!selectedFloors) {
                errors.push("Number of Floors");
            }
        }

        if (isCommercial) {
            if (descriptionInput && descriptionInput.value.trim() === "") {
                errors.push("Job Description");
                descriptionInput.classList.add("input-error");
            }
        }

        if (errors.length > 0) {
            event.preventDefault();

            formSummaryError.classList.add("active");
            formSummaryError.innerHTML = `
    <strong>⚠ Please complete the following required fields:</strong>
    <ul>
        ${errors.map((error) => `<li>${error}</li>`).join("")}
    </ul>

            `;

            formSummaryError.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            return;
        }
        event.preventDefault();

        formSummaryError.classList.remove("active");
        formSummaryError.innerHTML = "";

        if (formSuccessMessage) {
            formSuccessMessage.classList.remove("active");
        }

        if (successMessageText) {
            successMessageText.innerHTML = "";
        }

        const submitBtn = estimateForm.querySelector(".estimate-btn");

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }



        const templateParams = {
            property_type: selectedEstimateType ? selectedEstimateType.value : "",
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            street: addressInput.value,
            services: isCommercial
                ? "Not applicable"
                : Array.from(selectedServices)
                    .map(service => service.value)
                    .join(", "),
            floors: isCommercial
                ? "Not applicable"
                : selectedFloors
                    ? selectedFloors.value
                    : "",
            maps_link: mapsLinkInput.value ||
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressInput.value.trim())}`,
            description: descriptionInput.value
        };

        emailjs.send("service_ewn9f4h", "template_jef2v0m", templateParams)
            .then(() => {
                if (formSuccessMessage) {
                    formSuccessMessage.classList.add("active");
                    if (successMessageText) {
                        successMessageText.innerHTML = isCommercial
                            ? "✅ <strong>Thank you!</strong><br>Your information has been received."
                            : "✅ <strong>Thank you!</strong><br>Your estimate request has been received.";
                    }
                    formSuccessMessage.scrollIntoView({ behavior: "smooth", block: "center" });
                }

                estimateForm.reset();

                if (mapsLinkInput) {
                    mapsLinkInput.value = "";
                }

                if (locationStatus) {
                    locationStatus.textContent = "";
                }

                updateEstimateType();

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = getSubmitButtonText();
                }
            })
            .catch((error) => {
                console.error("EmailJS error:", error);

                formSummaryError.classList.add("active");
                formSummaryError.innerHTML = `
            <strong>⚠ We could not send your request.</strong>
            <ul>
                <li>Please try again later.</li>
            </ul>
        `;

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = getSubmitButtonText();
                }
            });
    });
}
/* LIVE VALIDATION */

document.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="tel"]'
).forEach((input) => {

    input.addEventListener("input", () => {

        if (input.value.trim() !== "") {
            input.classList.remove("input-error");
        }

    });

});
document.querySelectorAll('input[name="services"]').forEach((checkbox) => {

    checkbox.addEventListener("change", () => {

        const selected =
            document.querySelectorAll('input[name="services"]:checked');

        if (selected.length > 0) {

            const servicesError =
                document.getElementById("servicesError");

            if (servicesError)
                servicesError.textContent = "";

        }

    });

});

document.querySelectorAll('input[name="floors"]').forEach((radio) => {

    radio.addEventListener("change", () => {

        if (formSummaryError) {

            formSummaryError.classList.remove("active");

        }

    });

});

/* ESTIMATE TYPE */

const estimateTypeRadios = document.querySelectorAll('input[name="estimate_type"]');
const residentialFields = document.querySelectorAll(".residential-field");
const submitButton = document.querySelector(".estimate-btn");
const jobDescriptionTitle = document.getElementById("jobDescriptionTitle");
const jobDescription = document.getElementById("jobDescription");
const estimateIntro = document.getElementById("estimateIntro");

function getSubmitButtonText() {
    const selected = document.querySelector('input[name="estimate_type"]:checked');

    if (selected && selected.value === "Commercial") {
        return "SEND INFORMATION";
    }

    return "REQUEST FREE ESTIMATE";
}

function updateEstimateType() {
    const selected = document.querySelector('input[name="estimate_type"]:checked');

    if (!selected) return;

    if (selected.value === "Commercial") {
        residentialFields.forEach((section) => {
            section.style.display = "none";
        });

        if (submitButton) submitButton.textContent = getSubmitButtonText();
        if (estimateIntro) {
            estimateIntro.textContent = "Commercial building requests require an on-site review. Complete the form below and our team will contact you to schedule a visit.";
        }
        if (jobDescriptionTitle) jobDescriptionTitle.textContent = "Job Description *";
        if (jobDescription) {
            jobDescription.placeholder = "Please describe the building, approximate height, accessibility, and any details that will help us prepare the visit.";
        }
    } else {
        residentialFields.forEach((section) => {
            section.style.display = "";
        });

        if (submitButton) submitButton.textContent = getSubmitButtonText();
        if (estimateIntro) {
            estimateIntro.textContent = "Complete the form below and our team will review your request. You'll receive a response as soon as possible. Fields marked with * are required.";
        }
        if (jobDescriptionTitle) jobDescriptionTitle.textContent = "Job Description";
        if (jobDescription) {
            jobDescription.placeholder = "Tell us anything that may help us prepare your estimate. (Optional)";
        }
    }
}

estimateTypeRadios.forEach((radio) => {
    radio.addEventListener("change", updateEstimateType);
});

updateEstimateType();