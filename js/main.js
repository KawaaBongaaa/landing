(function() {
  const C = window.PIXPLACE_CONFIG || {};
  function renderBoards(containerId) {
    const el = document.getElementById(containerId);
    if (!el || !C.pinterestBoards) return;
    el.innerHTML = "";
    C.pinterestBoards.forEach((href) => {
      const a = document.createElement("a");
      a.setAttribute("data-pin-do","embedBoard");
      a.setAttribute("data-pin-board-width","900");
      a.setAttribute("data-pin-scale-height","220");
      a.setAttribute("data-pin-scale-width","120");
      a.href = href;
      a.className = "block my-8";
      el.appendChild(a);
    });
    if (!document.getElementById("pinit-js")) {
      const s = document.createElement("script");
      s.id = "pinit-js"; s.async = true; s.defer = true;
      s.src = "https://assets.pinterest.com/js/pinit.js";
      document.body.appendChild(s);
    } else {
      if (window.PinUtils && PinUtils.build) PinUtils.build();
    }
  }

  function setupLeadForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector('input[name="email"]').value.trim();
      const tg = form.querySelector('input[name="telegram"]').value.trim();
      const subject = encodeURIComponent("pixPLace lead");
      const body = encodeURIComponent(`Email: ${email}\nTelegram: ${tg}`);
      if (C.lead && C.lead.mailto) {
        window.location.href = `mailto:${C.lead.mailto}?subject=${subject}&body=${body}`;
      } else {
        alert("Thanks! We'll get back to you soon.");
      }
    });
  }

  async function buy(priceId) {
    if (!C.stripe || !C.stripe.publishableKey) return alert("Checkout not configured yet.");
    if (!window.Stripe) return alert("Stripe.js not loaded.");
    const stripe = Stripe(C.stripe.publishableKey);
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId || C.stripe.priceId, quantity: 1 }],
      mode: "subscription",
      successUrl: window.location.origin + "/success.html",
      cancelUrl: window.location.href
    });
    if (error) alert(error.message);
  }
  window.pixplace = { renderBoards, setupLeadForm, buy };
})();