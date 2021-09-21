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
  initParallax()
  initScrolling()
  initLogoChange()
  initViewportElems()
  initSwiperControls()
})

window.addEventListener("load", function () {
  panelScroll()
  initParallax()
  initScrolling()
  initViewportElems()
  initSwiperControls()
  tippy('[data-tippy-content]')

  let app = document.getElementById('welcom')

  if (app) {
    let typewriter = new Typewriter(app, {
      loop: false,
      delay: 50,
    })
  
    typewriter
      .typeString('TRANSFORM YOUR REALITY')
      .start()
  }

  // var wow = new WOW({
  //   boxClass: 'effect', // animated element css class (default is wow)
  //   animateClass: 'animated', // animation css class (default is animated)
  //   offset: 0, // distance to the element when triggering the animation (default is 0)
  //   mobile: false, // trigger animations on mobile devices (default is true)
  //   live: true, // act on asynchronously loaded content (default is true)
  //   callback: function (box) {
  //     // the callback is fired every time an animation is started
  //     // the argument that is passed in is the DOM node being animated
  //   },
  //   scrollContainer: null, // optional scroll container selector, otherwise use window,
  //   resetAnimation: true, // reset animation on end (default is true)
  // })
  // wow.init()

  setTimeout(function () {
    if (getCookie('policy') === undefined) {
      cookieBox.classList.add('display')
    }
  }, 500)
})

window.addEventListener("resize", function () {
  panelScroll()
})

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual'
} else {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0)
  }
}

// Days Left

const timeBox = document.querySelector('.subscribe .label strong')
const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24))
if (timeBox) timeBox.innerHTML = diffDays(new Date(), new Date('2021-09-25'))

// Panel Start/Stop Scrolling

let landing = document.querySelector('.landing-layout')
let panel = document.querySelector('.panel')
let promo = document.getElementById('promo')

if (landing) promo = document.querySelector('.product')

function panelScroll() {
  if (!panel) return false
  let rect = promo.getBoundingClientRect()
  if (landing) {
    window.scrollY + window.screen.height >= window.screen.height + rect.height + 120 ? panel.classList.add('bottom') : panel.classList.remove('bottom')
    if (rect.height + rect.top <= 384) {
      panel.classList.add('hidden')
      gender.classList.remove('display')
    } else {
      panel.classList.remove('hidden')
      gender.classList.add('display')
    }
  } else {
    window.scrollY + window.innerHeight >= parseFloat(getComputedStyle(promo, null).height.replace("px", "")) ?
      panel.classList.add('bottom') :
      panel.classList.remove('bottom')
  }
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

    if (input.value.length === 0 && errorMessage) {
      errorMessage.innerHTML = 'This field is required'
    } else if (input.classList.contains('password-type') && errorMessage) {
      if (input.value.length < 8 || input.value.length > 16) errorMessage.innerHTML = 'Passwords are 8-16 characters'
      else errorMessage.innerHTML = 'Uppercase letters, lowercase letters, special symbol and at least one number.'
    }

    if (input === passConf && passDef.value != passConf.value && errorMessage) {
      input.classList.add(invalidClassName)
      errorMessage.innerHTML = 'Passwords do not match'
    } else if (input.validity.valid) {
      input.classList.remove(invalidClassName)
    }
  })
})

// Subscribe Form

let subscribe = document.getElementById('subscribe')
let backEnter = document.querySelector('.backEnter')

if (subscribe) {
  subscribe.addEventListener('keyup', function (e) {
    let clone = subscribe.parentNode.querySelector('.clone')
    clone.innerHTML = subscribe.value
  })

  backEnter.addEventListener('click', function (e) {
    e.preventDefault()
    backEnter.closest("form").classList.remove('errorVisible')
  })
}

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
  let button = form.querySelector('button[type="submit"]')
  if (button) {
    button.addEventListener('click', function () {
      form.classList.add('errorVisible')
    })
  }

  form.onsubmit = async (e) => {
    e.preventDefault()

    form.classList.remove('errorVisible')

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

    if (result.snackbarText) createSnackbar(result.snackbarText, result.snackbarButton)
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

// Parallax

let parallaxImg = document.querySelectorAll('.parallax-bg > *')

function initParallax() {
  let i = 3
  parallaxImg.forEach(function (img, index) {
    if (index > 2) i = 12
    img.style.transform = "translateY(" + window.scrollY / i + "px)"
    if (index < 3) i++
  })
}

function initScrolling() {
  let body = document.querySelector("body")
  window.scrollY > 264 ? body.classList.add('scrolling') : body.classList.remove('scrolling')
}

let startBox = document.getElementById('promo')
let endBox = document.querySelector('.description')
let gallery = document.querySelector('.swiper')
let header = document.getElementById('header')
let gender = document.querySelector('.gender-choice')
let scrollButton = document.querySelector('#bottom .submit')

function initSwiperControls() {
  if (!gallery) return
  
  let startTop = startBox.getBoundingClientRect()
  let endTop = endBox.getBoundingClientRect()
  let bottom = footer.getBoundingClientRect()

  if (startTop.height + startTop.top - 144 <= 0 && endTop.top - window.screen.height + 72 >= 0) {
    gallery.classList.remove('hidden-controls')
    gender.classList.add('display')
  } else {
    gallery.classList.add('hidden-controls')
  }

  startTop.top * -1 >= startTop.height ? gender.classList.add('fixed') : gender.classList.remove('fixed')

  startTop.height + startTop.top - 48 <= 0 ?
    header.classList.add('black-style') : header.classList.remove('black-style')

  startTop.height + startTop.top - 336 <= 0 ?
    startBox.classList.add('hidden') : startBox.classList.remove('hidden')

  window.scrollY + document.body.clientHeight >= document.documentElement.scrollHeight - 216 ?
    scrollButton.classList.add('static') : scrollButton.classList.remove('static')
}

function isInViewport(el) {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

let viewportElems = document.querySelectorAll('.point-desc')

function initViewportElems() {
  viewportElems.forEach(function (box) {
    if (isInViewport(box)) box.classList.add('display')
  })
}

let logoH = document.getElementById('header')
let logoF = document.querySelector('#footer .logo')

function initLogoChange() {
  isInViewport(logoF) ? logoH.classList.add('hidden') : logoH.classList.remove('hidden')
}

// Product

// let colorParam = document.querySelectorAll('.color-style input')
// let productImgs = document.querySelectorAll('.product img')

// colorParam.forEach(function (color, index) {
//   color.addEventListener('change', function () {
//     let colorId = color.getAttribute('data-id')
//     let productImg = document.getElementById(colorId)
//     productImg.classList.add('display')
//     setTimeout(function () {
//       productImgs.forEach(function (img, imgIndex) {
//         if (colorId != img.getAttribute('id')) img.classList.remove('display')
//       })
//     }, 200)
//   })
// })

// Catalog

let catalogButton = document.getElementById('catalogButton')
let catalog = document.querySelector('.catalog')

if (catalogButton) {
  catalogButton.addEventListener('click', function (e) {
    e.preventDefault()
    catalogButton.classList.toggle('active')
    catalog.classList.toggle('display')
  })
  
  document.addEventListener('click', function (e) {
    if (e.target.id === 'catalogButton' || e.target.classList.contains('catalog')) return
    else {
      catalogButton.classList.remove('active')
      catalog.classList.remove('display')
    }
  })
}

// Noice Effect

var options = {
  "animate": true,
  "patternWidth": 247.74,
  "patternHeight": 80.24,
  "grainOpacity": 0.08,
  "grainDensity": 1.3,
  "grainWidth": 1,
  "grainHeight": 1
}

let bodyElem = document.querySelector('body')

if (bodyElem.classList.contains('home-layout')) grained("#wrapper", options)

// Video

let video = document.getElementById('video')
let mute = document.getElementById('muted')
let htmlTag = document.querySelector('html')

if (video) {
  mute.addEventListener('click', function(e) {
    video.muted = !video.muted
    mute.classList.toggle('on')
  })

  if (htmlTag.classList.contains('mobile')) {
    video.pause()
  }
}

// Cookie

let cookieBox = document.getElementById('cookie')
let accept

function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  }

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString()
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)

  for (let optionKey in options) {
    updatedCookie += " " + optionKey
    let optionValue = options[optionKey]
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue
    }
  }

  document.cookie = updatedCookie
}

// возвращает куки с указанным name,
// или undefined, если ничего не найдено
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

if (cookieBox) {
  accept = cookieBox.querySelector('.submit')

  accept.addEventListener('click', function (e) {
    e.preventDefault()
    setCookie('policy', true, {secure: true, 'max-age': 604800})
    cookieBox.classList.remove('display')
  })
}

// Product Gallery

const product = document.querySelector('.product')
let swiperBox = document.querySelector('.swiper')

if (product) {
  const swiper = new Swiper(swiperBox, {
    // Optional parameters
    loop: true,
    lazy: true,
    effect: "fade",
    slidesPerView: 1,
    spaceBetween: 0,
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  
  // Filter
  
  let filterInputs = document.querySelectorAll('.product input')
  let checked = ''
  let backLock = ''
  
  filterInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      filterInputs.forEach(function (check) {
        if (check.checked == true) {
          checked += check.value
        }
      })

      let index = checked.lastIndexOf("_")
      backLock = checked.substring(0, index)

      swiperBox.style.height = swiper.height + 'px'
      swiper.removeAllSlides()
      swiper.appendSlide([
        '<div class="swiper-slide">\
          <img data-src="images/filter/'+ backLock +'_180.webp" class="swiper-lazy" />\
        </div>',
        // '<div class="swiper-slide">\
        //   <img data-src="images/'+ checked +'_03.webp" class="swiper-lazy" />\
        // </div>',
        // '<div class="swiper-slide">\
        //   <img data-src="images/'+ checked +'_04.webp" class="swiper-lazy" />\
        // </div>',
        '<div class="swiper-slide">\
          <img data-src="images/filter/'+ checked +'.webp" class="swiper-lazy" />\
          <div class="point"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">\
              <circle cx="9" cy="9" r="9" fill="#00D1FF" fill-opacity="0.8" />\
              <circle cx="9" cy="9" r="1" fill="white" />\
              <circle cx="5" cy="9" r="1" fill="white" />\
              <circle cx="13" cy="9" r="1" fill="white" />\
              <circle cx="9" cy="13" r="1" fill="white" />\
              <circle cx="9" cy="5" r="1" fill="white" />\
            </svg>\
          </div>\
          <div class="point"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">\
              <circle cx="9" cy="9" r="9" fill="#00D1FF" fill-opacity="0.8" />\
              <circle cx="9" cy="9" r="1" fill="white" />\
              <circle cx="5" cy="9" r="1" fill="white" />\
              <circle cx="13" cy="9" r="1" fill="white" />\
              <circle cx="9" cy="13" r="1" fill="white" />\
              <circle cx="9" cy="5" r="1" fill="white" />\
            </svg>\
          </div>\
          <div class="point"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">\
              <circle cx="9" cy="9" r="9" fill="#00D1FF" fill-opacity="0.8" />\
              <circle cx="9" cy="9" r="1" fill="white" />\
              <circle cx="5" cy="9" r="1" fill="white" />\
              <circle cx="13" cy="9" r="1" fill="white" />\
              <circle cx="9" cy="13" r="1" fill="white" />\
              <circle cx="9" cy="5" r="1" fill="white" />\
            </svg>\
          </div>\
          <div class="point"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">\
              <circle cx="9" cy="9" r="9" fill="#00D1FF" fill-opacity="0.8" />\
              <circle cx="9" cy="9" r="1" fill="white" />\
              <circle cx="5" cy="9" r="1" fill="white" />\
              <circle cx="13" cy="9" r="1" fill="white" />\
              <circle cx="9" cy="13" r="1" fill="white" />\
              <circle cx="9" cy="5" r="1" fill="white" />\
            </svg>\
          </div>\
          <div class="point"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">\
              <circle cx="9" cy="9" r="9" fill="#00D1FF" fill-opacity="0.8" />\
              <circle cx="9" cy="9" r="1" fill="white" />\
              <circle cx="5" cy="9" r="1" fill="white" />\
              <circle cx="13" cy="9" r="1" fill="white" />\
              <circle cx="9" cy="13" r="1" fill="white" />\
              <circle cx="9" cy="5" r="1" fill="white" />\
            </svg>\
          </div>\
          <div class="point"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">\
              <circle cx="9" cy="9" r="9" fill="#00D1FF" fill-opacity="0.8" />\
              <circle cx="9" cy="9" r="1" fill="white" />\
              <circle cx="5" cy="9" r="1" fill="white" />\
              <circle cx="13" cy="9" r="1" fill="white" />\
              <circle cx="9" cy="13" r="1" fill="white" />\
              <circle cx="9" cy="5" r="1" fill="white" />\
            </svg>\
          </div>\
        </div>'
       ])
      swiper.lazy.load()
      swiper.update()
      swiper.slideTo(0)
      setTimeout(function(){
        swiperBox.removeAttribute('style')
      }, 100)
      checked = ''
    })
  })
}