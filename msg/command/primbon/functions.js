module.exports.Tanggal = function(tanggal) {
  const tgl = tanggal.replace(/-.*/, "");
  const bln = tanggal.replace(/-([^-?]+)(?=(?:$|\?))/, "").replace(/.*?-/, "");
  const thn = tanggal.replace(/.*\-/, "");
  const result = {
    tanggal: tgl,
    bulan: bln,
    tahun: thn
  };
  return result;
}

module.exports.replaceAll = function(string, find, replace) {
  return string.replace(new RegExp(find, 'g'), replace);
}
