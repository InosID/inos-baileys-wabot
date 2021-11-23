// Actions
exports.wait = () => {
  return `[⏳] Wait a moment...`
}
exports.done = () => {
  return `[☑️] Success!`
}

// Permission
exports.notAllowed = () => {
  return `[❕] This command is not permitted by the owner.`
}

// Require
exports.needQuery = () => {
  return `[❕] Query parameters not found.`
}
exports.needLink = () => {
  return `[❕] The link parameter was not found.`
}

// Result
exports.yt3res = (title, quality, type, size) => {
  return `
╭﹝🅈🅃🄼🄿③﹞
├ Title : ${title}
├ Quality : ${quality}
├ Type : ${type}
├ Size : ${size}
╰────────
`
}

// Feature
exports.nsfwHasOn = () => {
  return `[❕] Nsfw has been active before.`
}
exports.nsfwOff = () => {
  return `[❕] Nsfw is not enabled.`
}
