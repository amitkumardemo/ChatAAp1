(function($) {

  "use strict";

  var initPreloader = function() {
    $(document).ready(function($) {
    var Body = $('body');
        Body.addClass('preloader-site');
    });
    $(window).load(function() {
        $('.preloader-wrapper').fadeOut();
        $('body').removeClass('preloader-site');
    });
  }

  // init Chocolat light box
  var initChocolat = function() {
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    })
  }

  var initSwiper = function() {

    var swiper = new Swiper(".main-swiper", {
      speed: 500,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

    var category_swiper = new Swiper(".category-carousel", {
      slidesPerView: 6,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".category-carousel-next",
        prevEl: ".category-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 6,
        },
      }
    });

    var brand_swiper = new Swiper(".brand-carousel", {
      slidesPerView: 4,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".brand-carousel-next",
        prevEl: ".brand-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
        },
        991: {
          slidesPerView: 3,
        },
        1500: {
          slidesPerView: 4,
        },
      }
    });

    var products_swiper = new Swiper(".products-carousel", {
      slidesPerView: 5,
      spaceBetween: 30,
      speed: 500,
      navigation: {
        nextEl: ".products-carousel-next",
        prevEl: ".products-carousel-prev",
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
        },
        991: {
          slidesPerView: 4,
        },
        1500: {
          slidesPerView: 6,
        },
      }
    });

    // product single page
    var thumb_slider = new Swiper(".product-thumbnail-slider", {
      slidesPerView: 5,
      spaceBetween: 20,
      // autoplay: true,
      direction: "vertical",
      breakpoints: {
        0: {
          direction: "horizontal"
        },
        992: {
          direction: "vertical"
        },
      },
    });

    var large_slider = new Swiper(".product-large-slider", {
      slidesPerView: 1,
      // autoplay: true,
      spaceBetween: 0,
      effect: 'fade',
      thumbs: {
        swiper: thumb_slider,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  // input spinner
  var initProductQty = function(){

    $('.product-qty').each(function(){

      var $el_product = $(this);
      var quantity = 0;

      $el_product.find('.quantity-right-plus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('.quantity').val());
          $el_product.find('.quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function(e){
          e.preventDefault();
          var quantity = parseInt($el_product.find('.quantity').val());
          if(quantity>0){
            $el_product.find('.quantity').val(quantity - 1);
          }
      });

    });

  }


  // Wishlist management
  var wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  function updateWishlistUI() {
    // Update like icon color for liked products
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
      const productItem = btn.closest('.product-item');
      if (!productItem) return;
      const productName = productItem.querySelector('h3')?.textContent || '';
      if (wishlist.includes(productName)) {
        btn.querySelector('svg use').setAttribute('fill', 'red');
      } else {
        btn.querySelector('svg use').removeAttribute('fill');
      }
    });
  }

  // Handle like button clicks
  document.querySelectorAll('.btn-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productItem = btn.closest('.product-item');
      if (!productItem) return;

      const productName = productItem.querySelector('h3')?.textContent || 'Product';

      if (!wishlist.includes(productName)) {
        wishlist.push(productName);
        saveWishlist();
        updateWishlistUI();
        alert('Wishlist added: ' + productName);
      } else {
        alert('Already in wishlist: ' + productName);
      }
    });
  });

  // Cart management
  var cart = JSON.parse(localStorage.getItem('cart')) || [];

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateCartUI() {
    // Update cart badge count and total price in header
    var totalQty = 0;
    var totalPrice = 0;
    cart.forEach(item => {
      totalQty += item.quantity;
      totalPrice += item.quantity * item.price;
    });
    $('.cart-total').text('$' + totalPrice.toFixed(2));
    $('#cart-count').text(totalQty);
  }

  function addToCart(product) {
    var existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      cart.push(product);
    }
    saveCart();
    updateCartUI();
  }

  // Add to Cart button click handler
  $(document).on('click', '.nav-link:contains("Add to Cart")', function(e) {
    e.preventDefault();
    var $productItem = $(this).closest('.product-item');
    var id = $productItem.index();
    var name = $productItem.find('h3').text();
    var priceText = $productItem.find('.price').text();
    var price = parseFloat(priceText.replace('$', '')) || 0;
    var quantity = parseInt($productItem.find('.quantity').val()) || 1;
    var product = { id, name, price, quantity };
    addToCart(product);
    alert('Added to cart: ' + name);
  });

  // Place order
  function placeOrder() {
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to place order');
      window.location.href = 'login.html';
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    var total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Placeholder payment integration
    if (!confirm('Proceed to payment of $' + total.toFixed(2) + '?')) {
      return;
    }
    fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ products: cart, total }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.orderId) {
        alert('Order placed successfully! Order ID: ' + data.orderId);
        cart = [];
        saveCart();
        updateCartUI();
      } else {
        alert('Order failed: ' + (data.message || 'Unknown error'));
      }
    })
    .catch(() => alert('Error placing order'));
  }

  // Checkout button click handler
  $(document).on('click', '.offcanvas-body button[type="submit"]', function(e) {
    e.preventDefault();
    placeOrder();
  });

  // init jarallax parallax
  var initJarallax = function() {
    jarallax(document.querySelectorAll(".jarallax"));

    jarallax(document.querySelectorAll(".jarallax-keep-img"), {
      keepImg: true,
    });
  }

  // document ready
  $(document).ready(function() {
    
    initPreloader();
    initSwiper();
    initProductQty();
    initJarallax();
    initChocolat();
    updateCartUI();

  }); // End of a document

})(jQuery);
