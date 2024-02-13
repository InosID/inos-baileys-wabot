const { gpt } = require('gpti')

q = `
Sebuah lahan milik Pak Ali berukuran 8 m x 5 m akan dipasangi pagar besi tiga jenis di tepi lahannya. Masing-masing jenis pagar mempunyai Panjang 1 m, 2 m, dan 5 m. Banyak cara memasang pagar tersebut adalah ... (pemasangan pagar tidak boleh tumpang tindih)`

gpt({
  messages: [],
  prompt: q,
  model: "gpt-4",
  markdown: false
}, (err, data) => {
  console.log(data.gpt)
})