
async function initApp(){
  const cfg = await fetch('config.json').then(r=>r.json()).catch(()=>null);
  const leadForm = document.querySelector('#leadForm');
  const stripeBtn = document.querySelector('#stripeBtn');
  if (stripeBtn && cfg && cfg.stripe && cfg.stripe.paymentLink){
    stripeBtn.addEventListener('click', () => {
      window.open(cfg.stripe.paymentLink, '_blank');
    });
  }
  if (leadForm && cfg){
    leadForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = leadForm.querySelector('[name=email]').value.trim();
      const tg = leadForm.querySelector('[name=telegram]').value.trim();
      if (!email){
        alert('Please enter your email');
        return;
      }
      const mailto = cfg.lead && cfg.lead.mailto ? cfg.lead.mailto : 'hello@example.com';
      const subject = encodeURIComponent('pixPLace lead');
      const body = encodeURIComponent(`Email: ${email}\nTelegram: ${tg}`);
      window.location.href = `mailto:${mailto}?subject=${subject}&body=${body}`;
      setTimeout(()=>{
        window.location.href='success.html';
      },400);
    });
    const tgBtn = document.querySelector('#tgBtn');
    if (tgBtn && cfg.lead && cfg.lead.telegram){
      tgBtn.href = cfg.lead.telegram;
    }
  }
}
document.addEventListener('DOMContentLoaded', initApp);
