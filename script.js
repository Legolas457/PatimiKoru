// Firebase ve genel mantık için temel işlevler
document.addEventListener('DOMContentLoaded', () => {
  console.log("PatimiKoru yüklendi ve çalışmaya hazır!");
  
  // Örnek etkileşim fonksiyonu
  const actionButton = document.querySelector('#actionBtn');
  if (actionButton) {
    actionButton.addEventListener('click', () => {
      alert("Butona tıklandı! İşlem gerçekleştiriliyor...");
    });
  }
});

// Veri gönderme veya listeleme fonksiyonları için şablon
async function veriEkle(koleksiyonAdi, veriObjesi) {
  try {
    console.log(`${koleksiyonAdi} koleksiyonuna veri ekleniyor...`, veriObjesi);
    // Firestore ekleme işlemleri buraya gelecektir
  } catch (error) {
    console.error("Veri eklenirken hata oluştu:", error);
  }
}

