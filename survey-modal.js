/**
 * Al Dirayah Electromechanical Services LLC
 * Site Survey & Consultation Modal Handler
 * Dispatches inquiries via FormSubmit AJAX endpoint & provides direct mailto fallback
 */
(function() {
  "use strict";

  // Configurable Target Email (service@aldirayah.ae, or updated when user provides destination)
  var ENQUIRY_EMAIL = "service@aldirayah.ae";

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
        if (cleanCat.indexOf("villa") !== -1 || cleanCat.indexOf("residential") !== -1) {
          sel.value = "Custom Luxury Villa Elevators (MRL Traction)";
        } else if (cleanCat.indexOf("escalator") !== -1 || cleanCat.indexOf("walkway") !== -1 || cleanCat.indexOf("incline") !== -1) {
          sel.value = "30° & 35° Commercial Escalators (EN 115)";
        } else if (cleanCat.indexOf("accessibility") !== -1 || cleanCat.indexOf("determination") !== -1 || cleanCat.indexOf("elderly") !== -1) {
          sel.value = "Elderly & People of Determination Customized Lifts (EN 81-70)";
        } else if (cleanCat.indexOf("commercial") !== -1 || cleanCat.indexOf("skyscraper") !== -1) {
          sel.value = "High-Speed Commercial Skyscraper Lifts (4.0 m/s)";
        } else if (cleanCat.indexOf("maintenance") !== -1 || cleanCat.indexOf("amc") !== -1 || cleanCat.indexOf("repair") !== -1) {
          sel.value = "24/7 Rapid Emergency Response AMC Contract";
        } else if (cleanCat.indexOf("audit") !== -1 || cleanCat.indexOf("consultant") !== -1 || cleanCat.indexOf("engineering") !== -1) {
          sel.value = "Third-Party EN 81 Compliance Safety Audit";
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
    var originalBtnText = submitBtn ? submitBtn.textContent : "SUBMIT SITE SURVEY REQUEST →";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "DISPATCHING ENQUIRY...";
    }

    var ref = "DIR-" + Math.floor(100000 + Math.random() * 900000);
    var formData = new FormData(form);

    var service = formData.get("service") || "Site Survey Request";
    var propertyType = formData.get("property_type") || "Not specified";
    var projectStage = formData.get("project_stage") || "Not specified";
    var contactName = formData.get("contact_name") || "Not specified";
    var designation = formData.get("designation") || "Not specified";
    var phone = formData.get("phone") || "Not specified";
    var email = formData.get("email") || "Not specified";
    var units = formData.get("units") || "Not specified";
    var location = formData.get("location") || "Not specified";
    var notes = formData.get("notes") || "None";

    // FormSubmit payload
    var payload = new FormData();
    payload.append("_subject", "[AL DIRAYAH SITE SURVEY] Ref: " + ref + " - " + service);
    payload.append("_replyto", email);
    payload.append("_captcha", "false");
    payload.append("_template", "table");
    payload.append("Inquiry Reference", ref);
    payload.append("Service Required", service);
    payload.append("Property Type", propertyType);
    payload.append("Project Stage", projectStage);
    payload.append("Contact Name", contactName);
    payload.append("Designation / Role", designation);
    payload.append("Phone Number", phone);
    payload.append("Official Email", email);
    payload.append("Number of Units", units);
    payload.append("Emirate / Location", location);
    payload.append("Technical Notes", notes);

    // Direct mailto fallback
    var mailSubject = encodeURIComponent("[AL DIRAYAH SURVEY " + ref + "] " + service);
    var mailBody = encodeURIComponent(
      "Al Dirayah Electromechanical Services LLC — Engineering Desk\n\n" +
      "SITE SURVEY & TECHNICAL AUDIT REQUEST\n" +
      "═══════════════════════════════════════════\n" +
      "Reference: " + ref + "\n" +
      "Service: " + service + "\n" +
      "Property Type: " + propertyType + "\n" +
      "Project Stage: " + projectStage + "\n" +
      "Units: " + units + "\n" +
      "Location: " + location + "\n\n" +
      "CLIENT CONTACT DETAILS:\n" +
      "• Name: " + contactName + "\n" +
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

    // Send via FormSubmit AJAX endpoint (same architecture as Velan website)
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
