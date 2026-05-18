/* ==========================================================================
   ちばらき珈琲 - JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. Sticky Header Transition
     ========================================================================== */
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      // If we are over the dark section, we can adjust classes if needed, 
      // but a universal light frosted glass header works perfectly on all sections.
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check


  /* 2. Mobile Navigation Toggle
     ========================================================================== */
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true' || false;
      navToggle.setAttribute('aria-expanded', !expanded);
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu when links are clicked (crucial for single-page apps)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }


  /* 3. Scroll To Top Button
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scroll-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* 4. Hometown Tax Query Copy-to-Clipboard
     ========================================================================== */
  const btnCopy = document.getElementById('btn-copy-query');
  const queryField = document.getElementById('furusato-query');
  const copyToast = document.getElementById('copy-toast');

  if (btnCopy && queryField && copyToast) {
    btnCopy.addEventListener('click', () => {
      // Select the text
      queryField.select();
      queryField.setSelectionRange(0, 99999); // For mobile devices

      // Copy to clipboard
      navigator.clipboard.writeText(queryField.value)
        .then(() => {
          // Show toast alert
          copyToast.style.display = 'block';
          
          // Change copy button look momentarily
          btnCopy.innerHTML = '<i class="fa-solid fa-check"></i> コピー完了';
          btnCopy.style.backgroundColor = '#10b981';

          // Reset after 3 seconds
          setTimeout(() => {
            copyToast.style.display = 'none';
            btnCopy.innerHTML = '<i class="fa-regular fa-copy"></i> コピー';
            btnCopy.style.backgroundColor = '';
          }, 3000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          alert('コピーに失敗しました。手動で選択してコピーしてください。');
        });
    });
  }


  /* 5. Real-Time Estimate Simulator (出張コーヒー教室)
     ========================================================================== */
  const rangeSlider = document.getElementById('participants-range');
  const displayParticipants = document.getElementById('participants-display');
  const displayGroups = document.getElementById('groups-display');
  const chkDrip = document.getElementById('course-drip');
  const chkHistory = document.getElementById('course-history');
  const selectSouvenirs = document.getElementById('souvenirs-per-person');
  const selectTravel = document.getElementById('travel-distance');

  // Outputs
  const outTotal = document.getElementById('estimated-total');
  const outCourseCount = document.getElementById('calc-course-count');
  const outLectureFee = document.getElementById('calc-lecture-fee');
  const outGroupCount = document.getElementById('calc-group-count');
  const outMaterialsFee = document.getElementById('calc-materials-fee');
  const outSouvenirsCount = document.getElementById('calc-souvenir-count');
  const outSouvenirsFee = document.getElementById('calc-souvenirs-fee');
  const outTravelFee = document.getElementById('calc-travel-fee');

  const formatCurrency = (number) => {
    return new Intl.NumberFormat('ja-JP').format(number);
  };

  const calculateEstimate = () => {
    if (!rangeSlider) return;

    // Get input values
    const participants = parseInt(rangeSlider.value);
    const hasDrip = chkDrip.checked;
    const hasHistory = chkHistory.checked;
    const souvenirsPerPerson = parseInt(selectSouvenirs.value);
    const travelCost = parseInt(selectTravel.value);

    // 1. Course Selection and Lecture Fee
    let coursesCount = 0;
    if (hasDrip) coursesCount++;
    if (hasHistory) coursesCount++;
    
    const lectureFee = coursesCount * 24000;

    // 2. Groups Calculation (PDF specifies 3-4 people per group)
    // Formula: dividing by 3.5 yields 5 groups for 17 participants, matching the PDF's quotation exactly!
    const groupCount = Math.ceil(participants / 3.5);

    // 3. Materials Fee
    // Materials are only required if the Hand Drip extraction course is selected
    const materialsFee = hasDrip ? (groupCount * 2160) : 0;

    // 4. Souvenirs
    const souvenirsCount = participants * souvenirsPerPerson;
    const souvenirsFee = souvenirsCount * 216;

    // 5. Total
    const totalCost = lectureFee + materialsFee + souvenirsFee + travelCost;

    // Update controls display
    displayParticipants.textContent = participants;
    displayGroups.textContent = groupCount;

    // Update Result Panel
    outTotal.textContent = formatCurrency(totalCost);
    outCourseCount.textContent = coursesCount;
    outLectureFee.textContent = formatCurrency(lectureFee);
    outGroupCount.textContent = hasDrip ? groupCount : 0;
    outMaterialsFee.textContent = formatCurrency(materialsFee);
    outSouvenirsCount.textContent = souvenirsCount;
    outSouvenirsFee.textContent = formatCurrency(souvenirsFee);
    outTravelFee.textContent = formatCurrency(travelCost);
  };

  // Add listeners to all estimator elements
  const estimatorElements = [rangeSlider, chkDrip, chkHistory, selectSouvenirs, selectTravel];
  estimatorElements.forEach(elem => {
    if (elem) {
      elem.addEventListener('input', calculateEstimate);
      elem.addEventListener('change', calculateEstimate);
    }
  });

  // Run initial calculation
  calculateEstimate();


  /* 6. Contact Form - Show/Hide Workshop Details & Form Submission
     ========================================================================== */
  const inquiryRadioGroup = document.getElementsByName('inquiry_type');
  const workshopDetailsBox = document.getElementById('workshop-form-details');
  const inquiryForm = document.getElementById('inquiry-form');
  const formSuccessAlert = document.getElementById('form-success');

  // Toggle Conditional Fields based on Inquiry Type
  const toggleWorkshopDetails = () => {
    let selectedType = 'general';
    for (const radio of inquiryRadioGroup) {
      if (radio.checked) {
        selectedType = radio.value;
        break;
      }
    }

    if (selectedType === 'workshop') {
      workshopDetailsBox.style.display = 'block';
      // Mark fields required if needed, or leave optional
    } else {
      workshopDetailsBox.style.display = 'none';
    }
  };

  for (const radio of inquiryRadioGroup) {
    radio.addEventListener('change', toggleWorkshopDetails);
  }
  
  // Initialize toggle state
  toggleWorkshopDetails();

  // Form Submission Handler
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic front-end validation
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !phone || !message) {
        alert('必須項目をすべてご入力ください。');
        return;
      }

      // Check if it's a workshop request and at least one course is selected
      let selectedType = 'general';
      for (const radio of inquiryRadioGroup) {
        if (radio.checked) {
          selectedType = radio.value;
          break;
        }
      }

      if (selectedType === 'workshop') {
        const dripCheck = document.querySelector('input[name="courses"][value="drip"]');
        const historyCheck = document.querySelector('input[name="courses"][value="history"]');
        if (dripCheck && historyCheck && !dripCheck.checked && !historyCheck.checked) {
          alert('出張セミナーのご依頼の場合は、ご希望のコースを少なくとも1つ選択してください。');
          return;
        }
      }

      // FormSubmit AJAX submission
      const submitBtn = inquiryForm.querySelector('.btn-submit');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 送信中...';

      // Send form data to FormSubmit API via AJAX (No page redirects)
      fetch('https://formsubmit.co/ajax/barista.kenkyugakuen@gmail.com', {
        method: 'POST',
        body: new FormData(inquiryForm)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        
        // Show success alert
        formSuccessAlert.style.display = 'flex';
        
        // Reset form
        inquiryForm.reset();
        
        // Refresh workshop details toggle
        toggleWorkshopDetails();
        
        // Scroll smoothly to success alert
        formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Hide alert after 8 seconds
        setTimeout(() => {
          formSuccessAlert.style.opacity = '0';
          setTimeout(() => {
            formSuccessAlert.style.display = 'none';
            formSuccessAlert.style.opacity = '1';
          }, 400);
        }, 8000);
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        alert('送信中にエラーが発生しました。お手数ですが、時間を置いて再度お試しいただくか、直接 barista.kenkyugakuen@gmail.com までメールにてご連絡ください。');
      });

    });
  }

  /* 7. BASE Shop Automatic 5-Second Slideshow
     ========================================================================== */
  const baseSlides = document.querySelectorAll('.base-slideshow .slide-img');
  if (baseSlides.length > 0) {
    let currentSlide = 0;
    setInterval(() => {
      // Fade out current slide
      baseSlides[currentSlide].style.opacity = '0';
      baseSlides[currentSlide].style.zIndex = '1';
      
      // Calculate next slide index
      currentSlide = (currentSlide + 1) % baseSlides.length;
      
      // Fade in next slide
      baseSlides[currentSlide].style.opacity = '1';
      baseSlides[currentSlide].style.zIndex = '2';
    }, 5000);
  }

});
