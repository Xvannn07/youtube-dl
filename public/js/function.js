// import
const alertContainer = document.getElementById('alert-container')

function convertToTime(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  // Format waktu
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  return formattedTime;
}

function convertDateFormat(uploadDate) {
  const date = new Date(uploadDate);
  
  // Mendapatkan informasi tanggal, bulan, dan tahun
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Bulan dimulai dari 0
  const day = date.getDate().toString().padStart(2, '0');

  // Mendapatkan informasi jam, menit, dan detik
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  // Format tanggal baru
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}

function convertViews(views) {
  let formattedViews;
  if (views >= 1000000000) {
      formattedViews = (views / 1000000000).toFixed(1) + 'B'; // Konversi ke miliar
  } else if (views >= 1000000) {
      formattedViews = (views / 1000000).toFixed(1) + 'M'; // Konversi ke juta
  } else if (views >= 1000) {
      formattedViews = (views / 1000).toFixed(1) + 'K'; // Konversi ke ribuan
  } else {
      formattedViews = views.toString(); // Tidak perlu konversi jika di bawah 1000
  }
  return formattedViews;
}

function byteToMegabyte(bytes) {
  const megabyte = bytes / (1024 * 1024);
  return megabyte.toFixed(2) + ' MB';
}

async function costumAlert(message, { status }) {
  await fetch("/file/alert.html", {
    method: "GET"
  })
  .then(resp => resp.text())
  .then(htmls => {
    alertContainer.innerHTML = htmls;
    if(status == "fail") {
      const alert = document.getElementById('alert');
      alert.classList.add('alert', 'alert-bg-red')
      const icon_alert = document.getElementById('icon-alert')
      const icon = `<lord-icon src="https://cdn.lordicon.com/keaiyjcx.json" trigger="loop" delay="2000"></lord-icon>`;
      icon_alert.innerHTML = icon;
      document.getElementById('alert-message').textContent = message;
      alertContainer.style.display = 'block';
    } else if(status == "procces") {
      const alert = document.getElementById('alert');
      alert.classList.add('alert', 'alert-bg-orange');
      const icon_alert = document.getElementById('icon-alert')
      const icon = `<lord-icon src="https://cdn.lordicon.com/dafdkyyt.json" trigger="loop" delay="2000"></lord-icon>`;
      icon_alert.innerHTML = icon;
      document.getElementById('alert-message').textContent = message;
      alertContainer.style.display = 'block';
    } else if(status == "succes") {
      const alert = document.getElementById('alert');
      alert.classList.add('alert', 'alert-bg-green');
      const icon_alert = document.getElementById('icon-alert')
      const icon = `<lord-icon src="https://cdn.lordicon.com/lomfljuq.json" trigger="loop" delay="2000"></lord-icon>`;
      icon_alert.innerHTML = icon;
      document.getElementById('alert-message').textContent = message;
      alertContainer.style.display = 'block';
    } else return ""
  });
  }
