// Jalankan setiap jam (Menit ke-0)
cron.schedule("0 * * * *", async () => {
  console.log(">>> [CRON] Cek order kadaluarsa (> 48 Jam)...");

  // Batas waktu: Sekarang dikurangi 48 jam
  const deadline = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // Cari yang pending DAN dibuat sebelum deadline
  const expiredTransactions = await Transaction.findAll({
    where: {
      status: "pending",
      createdAt: { [Op.lt]: deadline },
    },
    include: ["details"], // Pastikan include detail utk balikin stok
  });

  // ... (Logika loop cancel & restock sama seperti sebelumnya) ...
});
