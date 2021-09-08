function handleWindow() {
  let body = document.querySelector("body");

  if (window.innerWidth > body.clientWidth + 5) {
    body.classList.add("has-scrollbar");
    body.setAttribute(
      "style",
      "--scroll-bar: " + (window.innerWidth - body.clientWidth) + "px"
    );
  } else {
    body.classList.remove("has-scrollbar");
    body.setAttribute("style", "--scroll-bar: 0px");
  }
}

handleWindow();

// The resize isn't very necessary:
window.addEventListener("resize", handleWindow);

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);

window.addEventListener("scroll", function () {
  panelScroll()
});

window.addEventListener("load", function () {
  panelScroll()
  tippy('[data-tippy-content]')
});

window.addEventListener("resize", function () {
  panelScroll()
});

// Panel Start/Stop Scrolling

let panel = document.querySelector('.panel')
let promo = document.getElementById('promo')

function panelScroll() {
  if (!panel) return false;
  window.scrollY + window.innerHeight >= parseFloat(getComputedStyle(promo, null).height.replace("px", "")) ?
    panel.classList.add('bottom') :
    panel.classList.remove('bottom')
}

// Validation

let invalidClassName = 'error'
let inputs = document.querySelectorAll('input, select, textarea')
inputs.forEach(function (input) {
  // Add a css class on submit when the input is invalid.
  input.addEventListener('invalid', function (e) {
    let errorMessage = input.parentNode.querySelector('span.error')
    input.classList.add(invalidClassName);
    if (input.value.length === 0) {
      errorMessage.innerHTML = 'This field is required'
    } else if (input.getAttribute('type') === "password") {
      if (input.value.length < 8 || input.value.length > 16) errorMessage.innerHTML = 'Passwords are 8-16 characters'
      else errorMessage.innerHTML = 'Passwords are 8-16 characters with uppercase letters, lowercase letters, special symbol and at least one number.'
    }
    // if (input.classList.contains('confirm-password')) {
    //   console.log('confirm-password')
    // }
    e.preventDefault();
  })

  // Remove the class when the input becomes valid.
  // 'input' will fire each time the user types
  input.addEventListener('input', function () {
    if (input.validity.valid) {
      input.classList.remove(invalidClassName)
    }
  })
});

// Toggle Password Visible

let togglePassword = document.querySelector('.toggle-password')

togglePassword.addEventListener('click', function (event) {
  togglePassword.classList.toggle('selected')

  let inputElem = togglePassword.parentNode.querySelectorAll('input')[0]

  togglePassword.classList.contains('selected') ?
    inputElem.setAttribute('type', 'text') :
    inputElem.setAttribute('type', 'password')
});

// Ajax Form Submit

let forms = document.querySelectorAll('form')

forms.forEach(function (form) {
  form.onsubmit = async (e) => {
    e.preventDefault()

    let link = form.getAttribute('action')
    let method = form.getAttribute('method')

    let response = await fetch(link, {
      method: method,
      body: new FormData(form)
    });

    let result = await response.json()

    result.message ?
      form.classList.add('success') :
      Fancybox.close()

    form.reset()
  };
})

// Tabs

let tabs = document.querySelectorAll('.tabs a, .external-tab');

tabs.forEach(function (tab) {
  tab.addEventListener('click', function (event) {
    event.preventDefault()

    if (tab.parentNode.tagName === 'LI') tab.parentNode.parentNode.querySelector('.active').classList.remove('active')

    let id = tab.getAttribute('href').substring(1)
    let tabBlock = document.getElementById(id)

    tabBlock.parentNode.querySelectorAll('.tab').forEach(function (elem) {
      elem.classList.remove('display')
      if (elem.tagName === 'FORM') elem.reset()
    })

    if (tab.parentNode.tagName === 'LI') tab.parentNode.classList.add('active');
    tabBlock.classList.add('display')
  })
})

// Accordion

initAcc('#accordion', true);

function initAcc(elem, option) {
  document.addEventListener('click', function (e) {
    if (!e.target.matches(elem + ' .accordion-header')) return
    else {
      if (!e.target.parentNode.classList.contains('display')) {
        if (option == true) {
          var elementList = document.querySelectorAll(elem + ' .accordion-exp')
          Array.prototype.forEach.call(elementList, function (e) {
            e.parentNode.classList.remove('display')
          });
        }
        e.target.parentNode.classList.add('display')
      } else {
        e.target.parentNode.classList.remove('display')
      }
    }
  });
}