let help = (v) => {
  return `
β­οΉπΌπ°πΈπ½οΉ
β ${v}menu
β ${v}help
β ${v}?
β°ββββββββ
β­οΉπππΈπ²πΊπ΄ποΉ
β ${v}sticker
β ${v}stiker
β ${v}s
β ${v}stickergif
β ${v}stikergif
β ${v}sgif
β°ββββββββββββ
β­οΉπΈπ½π΅πΎππΌπ°ππΈπΎπ½οΉ
β ${v}infogempa
β ${v}wiki (query)
β ${v}wikien (query)
β°ββββββββββββββββββ
β­οΉπ°π½πΈπΌπ΄οΉ
β ${v}nekonime
β ${v}nsfwanime
β ${v}hentai
β ${v}wallpaper
β°ββββββββββ
β­οΉπ³πΎππ½π»πΎπ°π³π΄ποΉ
β ${v}ytmp3 (url)
β ${v}ytmp4 (url)
β ${v}tiktok (url)
β ${v}igstory (username)
β°ββββββββββββββββ
β­οΉπΆππΎππΏοΉ
β ${v}enable (nsfw)
β ${v}disable (nsfw)
β ${v}demote (@tag)
β ${v}promote (@tag)
β°βββββββββ
β­οΉπΆπ°πΌπ΄οΉ
β ${v}tekateki
β ${v}tebakanime
β°ββββββββ
β­οΉπΏππΈπΌπ±πΎπ½οΉ
β ${v}artimimpi (query)
β ${v}artinama (name)
β ${v}haribaik (date)
β ${v}harilarangan (date)
β ${v}kecocokannama (name)|(date)
β ${v}ramaljodoh (name1)|(name2)
β ${v}ramalanjodoh (name1)|(date1)|(name2)|(date2)
β ${v}rejekiweton (date)
β ${v}tanggaljadian (date)
β ${v}watakartis (name)|(date)
β°ββββββββββββ
β­οΉπππ°π»πΊπ΄ποΉ
β ${v}githubstalk (user)
β°ββββββββββββ
β­οΉπΌπ°πΊπ΄ποΉ
β ${v}photofunia light (text)
β ${v}photofunia snow (text)
β°βββββββββ
β­οΉπΎππ·π΄ποΉ
β ${v}halah (text)
β ${v}hilih (text)
β°βββββββββ`
}

function welcomeOpt() {
  return `
Option:
- @user = tag joined user
`
}

module.exports = { help, welcomeOpt }

/*
β ${v}setwelcome text (text)
β ${v}setwelcome useprofile (true/false)
β ${v}setwelcome opt
β ${v}simulation welcome
β ${v}simulasi welcome
*/
