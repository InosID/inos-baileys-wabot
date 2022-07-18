let help = (v) => {
  return `
╭﹝🄼🄰🄸🄽﹞
├ ${v}menu
├ ${v}help
├ ${v}?
╰────────
╭﹝🅂🅃🄸🄲🄺🄴🅁﹞
├ ${v}sticker
├ ${v}stiker
├ ${v}s
├ ${v}stickergif
├ ${v}stikergif
├ ${v}sgif
╰────────────
╭﹝🄸🄽🄵🄾🅁🄼🄰🅃🄸🄾🄽﹞
├ ${v}infogempa
├ ${v}wiki (query)
├ ${v}wikien (query)
╰──────────────────
╭﹝🄰🄽🄸🄼🄴﹞
├ ${v}nekonime
├ ${v}nsfwanime
├ ${v}hentai
├ ${v}wallpaper
╰──────────
╭﹝🄳🄾🅆🄽🄻🄾🄰🄳🄴🅁﹞
├ ${v}ytmp3 (url)
├ ${v}ytmp4 (url)
├ ${v}tiktok (url)
├ ${v}igstory (username)
╰────────────────
╭﹝🄶🅁🄾🅄🄿﹞
├ ${v}enable (nsfw)
├ ${v}disable (nsfw)
├ ${v}demote (@tag)
├ ${v}promote (@tag)
╰─────────
╭﹝🄶🄰🄼🄴﹞
├ ${v}tekateki
├ ${v}tebakanime
╰────────
╭﹝🄿🅁🄸🄼🄱🄾🄽﹞
├ ${v}artimimpi (query)
├ ${v}artinama (name)
├ ${v}haribaik (date)
├ ${v}harilarangan (date)
├ ${v}kecocokannama (name)|(date)
├ ${v}ramaljodoh (name1)|(name2)
├ ${v}ramalanjodoh (name1)|(date1)|(name2)|(date2)
├ ${v}rejekiweton (date)
├ ${v}tanggaljadian (date)
├ ${v}watakartis (name)|(date)
╰────────────
╭﹝🅂🅃🄰🄻🄺🄴🅁﹞
├ ${v}githubstalk (user)
╰────────────
╭﹝🄼🄰🄺🄴🅁﹞
├ ${v}photofunia light (text)
├ ${v}photofunia snow (text)
╰─────────
╭﹝🄾🅃🄷🄴🅁﹞
├ ${v}halah (text)
├ ${v}hilih (text)
╰─────────`
}

function welcomeOpt() {
  return `
Option:
- @user = tag joined user
`
}

module.exports = { help, welcomeOpt }

/*
├ ${v}setwelcome text (text)
├ ${v}setwelcome useprofile (true/false)
├ ${v}setwelcome opt
├ ${v}simulation welcome
├ ${v}simulasi welcome
*/
