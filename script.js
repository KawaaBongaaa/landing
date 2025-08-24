function subscribe(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const telegram = document.getElementById("telegram").value;
  alert("Спасибо! Ваша заявка отправлена. Email: " + email + ", Telegram: " + telegram);
}
