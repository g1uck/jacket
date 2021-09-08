function handleWindow() {
  let body = document.querySelector("body")

  if (window.innerWidth > body.clientWidth + 5) {
    body.classList.add("has-scrollbar")
    body.setAttribute(
      "style",
      "--scroll-bar: " + (window.innerWidth - body.clientWidth) + "px"
    )
  } else {
    body.classList.remove("has-scrollbar")
    body.setAttribute("style", "--scroll-bar: 0px")
  }
}

handleWindow()

// The resize isn't very necessary:
window.addEventListener("resize", handleWindow)

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`)

window.addEventListener("scroll", function () {
  panelScroll()
})

window.addEventListener("load", function () {
  panelScroll()
  tippy('[data-tippy-content]')
})

window.addEventListener("resize", function () {
  panelScroll()
})

// Panel Start/Stop Scrolling

let panel = document.querySelector('.panel')
let promo = document.getElementById('promo')

function panelScroll() {
  if (!panel) return false
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
    input.classList.add(invalidClassName)
    e.preventDefault()
  })

  // Remove the class when the input becomes valid.
  // 'input' will fire each time the user types
  input.addEventListener('input', function () {
    let passDef = document.getElementById("password")
    let passConf = document.getElementById("confirm-password")
    let errorMessage = input.parentNode.querySelector('span.error')

    if (input.value.length === 0) {
      errorMessage.innerHTML = 'This field is required'
    } else if (input.getAttribute('type') === "password") {
      if (input.value.length < 8 || input.value.length > 16) errorMessage.innerHTML = 'Passwords are 8-16 characters'
      else errorMessage.innerHTML = 'Uppercase letters, lowercase letters, special symbol and at least one number.'
    }

    if (input === passConf && passDef.value != passConf.value) {
      input.classList.add(invalidClassName)
      errorMessage.innerHTML = 'Passwords do not match'
    } else if (input.validity.valid) {
      input.classList.remove(invalidClassName)
    }
  })
})

// Toggle Password Visible

let togglePassword = document.querySelectorAll('.toggle-password')

togglePassword.forEach(function (toggle) {
  toggle.addEventListener('click', function (event) {
    toggle.classList.toggle('selected')
  
    let inputElem = toggle.parentNode.querySelectorAll('input')[0]
  
    toggle.classList.contains('selected') ?
      inputElem.setAttribute('type', 'text') :
      inputElem.setAttribute('type', 'password')
  })
})

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
    })

    let result = await response.json()

    if (result.redirect) window.location.href = result.redirect

    result.message ?
      form.classList.add('success') :
      Fancybox.close()

    form.reset()

    if (result.snackbarText) createSnackbar(result.snackbarText, result.snackbarButton);
  }
})

// Tabs

let tabs = document.querySelectorAll('.tabs a, .external-tab')

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

    if (tab.parentNode.tagName === 'LI') tab.parentNode.classList.add('active')
    tabBlock.classList.add('display')
  })
})

// Accordion

initAcc('#accordion', true)

function initAcc(elem, option) {
  document.addEventListener('click', function (e) {
    if (!e.target.matches(elem + ' .accordion-header')) return
    else {
      if (!e.target.parentNode.classList.contains('display')) {
        if (option == true) {
          let elementList = document.querySelectorAll(elem + ' .accordion-exp')
          Array.prototype.forEach.call(elementList, function (e) {
            e.parentNode.classList.remove('display')
          })
        }
        e.target.parentNode.classList.add('display')
      } else {
        e.target.parentNode.classList.remove('display')
      }
    }
  })
}

// Snackbar

let createSnackbar = (function () {
  // Any snackbar that is already shown
  let previous = null

  return function (message, actionText, action) {
    if (previous) {
      previous.dismiss()
    }
    let snackbar = document.createElement("div")
    snackbar.className = "snackbar"
    snackbar.dismiss = function () {
      this.style.opacity = 0
    }
    let label = document.createElement("div")
    label.className = "snackbar__label"
    let text = document.createTextNode(message)
    label.appendChild(text)
    snackbar.appendChild(label)

    if (actionText) {
      if (!action) {
        console.log('close');
        action = snackbar.dismiss.bind(snackbar)
      }
      let actionButton = document.createElement("button")
      actionButton.className = "snackbar__action"
      actionButton.innerHTML = actionText
      actionButton.addEventListener("click", action)
      snackbar.appendChild(actionButton)
    }

    setTimeout(
      function () {
        if (previous === this) {
          previous.dismiss()
        }
      }.bind(snackbar),
      6000
    )

    snackbar.addEventListener(
      "transitionend",
      function (event, elapsed) {
        if (event.propertyName === "opacity" && this.style.opacity == 0) {
          this.parentElement.removeChild(this)
          if (previous === this) {
            previous = null
          }
        }
      }.bind(snackbar)
    )

    previous = snackbar
    document.body.appendChild(snackbar)
    // In order for the animations to trigger, I have to force the original style to be computed, and then change it.
    snackbar.style.opacity = 1
  }
})()