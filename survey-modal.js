/**
 * Al Dirayah Electromechanical Services LLC
 * Site Survey & Consultation Modal Handler
 * Dispatches inquiries via FormSubmit AJAX endpoint & provides direct mailto fallback
 */
(function() {
  "use strict";

  // Configurable Target Email (temporarily directed to aldirayahuae@gmail.com per user request)
  var ENQUIRY_EMAIL = "aldirayahuae@gmail.com";

  window.setEnquiryEmail = function(newEmail) {
    if (newEmail && typeof newEmail === "string") {
      ENQUIRY_EMAIL = newEmail.trim();
    }
  };

  window.openSurveyModal = function(cat) {
    var modal = document.getElementById("surveyModal");
    var formView = document.getElementById("surveyFormView");
    var successView = document.getElementById("surveySuccessView");
    var sel = document.getElementById("mEquip");

    if (formView) formView.style.display = "block";
    if (successView) successView.style.display = "none";

    if (sel && cat) {
      var found = false;
      var cleanCat = String(cat).trim().toLowerCase();
      for (var i = 0; i < sel.options.length; i++) {
        var optVal = sel.options[i].value.toLowerCase();
        var optTxt = sel.options[i].text.toLowerCase();
        if (optVal === cleanCat || optTxt === cleanCat || optTxt.indexOf(cleanCat) !== -1 || cleanCat.indexOf(optTxt) !== -1) {
          sel.selectedIndex = i;
          found = true;
          break;
        }
      }
      if (!found) {
        if (cleanCat.indexOf("villa") !== -1 || cleanCat.indexOf("residential") !== -1 || cleanCat.indexOf("estate") !== -1) {
          sel.value = "Villa lift";
        } else if (cleanCat.indexOf("escalator") !== -1 || cleanCat.indexOf("walkway") !== -1 || cleanCat.indexOf("incline") !== -1) {
          sel.value = "New escalator";
        } else if (cleanCat.indexOf("breakdown") !== -1 || cleanCat.indexOf("repair") !== -1 || cleanCat.indexOf("broken") !== -1 || cleanCat.indexOf("emergency") !== -1) {
          sel.value = "Repair / breakdown";
        } else if (cleanCat.indexOf("maintenance") !== -1 || cleanCat.indexOf("amc") !== -1 || cleanCat.indexOf("fit-out") !== -1) {
          sel.value = "Maintenance (AMC)";
        } else if (cleanCat.indexOf("audit") !== -1 || cleanCat.indexOf("civil") !== -1 || cleanCat.indexOf("engineering") !== -1 || cleanCat.indexOf("traffic") !== -1) {
          sel.value = "Audit or Civil Defence";
        } else {
          sel.value = "New lift";
        }
      }
    }

    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  };

  window.closeSurveyModal = function() {
    var modal = document.getElementById("surveyModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  document.addEventListener("click", function(e) {
    var modal = document.getElementById("surveyModal");
    if (modal && e.target === modal) {
      closeSurveyModal();
    }
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      closeSurveyModal();
    }
  });

  window.handleSurveySubmit = function(e) {
    e.preventDefault();
    var form = e.target;

    // Honeypot spam check
    var honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) {
      closeSurveyModal();
      return;
    }

    var submitBtn = document.getElementById("surveySubmitBtn");
    var originalBtnText = submitBtn ? submitBtn.textContent : "Send request";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    var ref = "DIR-" + Math.floor(100000 + Math.random() * 900000);
    var formData = new FormData(form);

    var service = formData.get("service") || "Site Visit Request";
    var propertyType = formData.get("property_type") || "Not specified";
    var projectStage = formData.get("project_stage") || "Not specified";
    var contactName = (formData.get("contact_name") || "").trim();
    var designation = formData.get("designation") || "Not specified";
    var phone = formData.get("phone") || "Not specified";
    var email = formData.get("email") || "Not specified";
    var units = formData.get("units") || "Not specified";
    var location = formData.get("location") || "Not specified";
    var notes = formData.get("notes") || "None";

    // FormSubmit payload
    var payload = new FormData();
    payload.append("_subject", "[AL DIRAYAH SITE VISIT] Ref: " + ref + " - " + service);
    payload.append("_replyto", email);
    payload.append("_captcha", "false");
    payload.append("_template", "table");
    payload.append("Inquiry Reference", ref);
    payload.append("Service Required", service);
    payload.append("Property Type", propertyType);
    payload.append("Project Stage", projectStage);
    payload.append("Contact Name", contactName || "Not specified");
    payload.append("Designation / Role", designation);
    payload.append("Phone Number", phone);
    payload.append("Email", email);
    payload.append("Number of Units", units);
    payload.append("Emirate / Location", location);
    payload.append("Technical Notes", notes);

    // Direct mailto fallback
    var mailSubject = encodeURIComponent("[AL DIRAYAH SITE VISIT " + ref + "] " + service);
    var mailBody = encodeURIComponent(
      "Al Dirayah Electromechanical Services LLC\n\n" +
      "BOOK A SITE VISIT REQUEST\n" +
      "═══════════════════════════════════════════\n" +
      "Reference: " + ref + "\n" +
      "Service: " + service + "\n" +
      "Property Type: " + propertyType + "\n" +
      "Project Stage: " + projectStage + "\n" +
      "Units: " + units + "\n" +
      "Location: " + location + "\n\n" +
      "CLIENT CONTACT DETAILS:\n" +
      "• Name: " + (contactName || "Not specified") + "\n" +
      "• Role: " + designation + "\n" +
      "• Phone: " + phone + "\n" +
      "• Email: " + email + "\n\n" +
      "TECHNICAL REQUIREMENTS:\n" +
      notes + "\n\n" +
      "Sent via al-dirayah web portal."
    );
    var mailtoLink = "mailto:" + ENQUIRY_EMAIL + "?subject=" + mailSubject + "&body=" + mailBody;

    var mailtoBtn = document.getElementById("surveyMailtoBtn");
    if (mailtoBtn) mailtoBtn.href = mailtoLink;

    var refEl = document.getElementById("surveyRefNum");
    if (refEl) refEl.textContent = ref;

    var targetEmailEl = document.getElementById("surveyTargetEmail");
    if (targetEmailEl) targetEmailEl.textContent = ENQUIRY_EMAIL;

    // Personalize greeting on success: "Thanks, [Name]."
    var greeting = contactName ? ("Thanks, " + contactName + ".") : "Thanks!";
    var greetingEl = document.getElementById("surveySuccessGreeting");
    if (greetingEl) {
      greetingEl.textContent = greeting;
    }

    // Send via FormSubmit AJAX endpoint
    fetch("https://formsubmit.co/ajax/" + encodeURIComponent(ENQUIRY_EMAIL), {
      method: "POST",
      body: payload,
      headers: { "Accept": "application/json" }
    })
    .then(function(res) {
      return res.json().catch(function() { return {}; });
    })
    .then(function(data) {
      console.log("Enquiry dispatched successfully:", data);
    })
    .catch(function(err) {
      console.warn("FormSubmit fetch note:", err);
    })
    .finally(function() {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
      var formView = document.getElementById("surveyFormView");
      var successView = document.getElementById("surveySuccessView");
      if (formView) formView.style.display = "none";
      if (successView) successView.style.display = "block";
      form.reset();
    });
  };
})();
