// Actions
exports.wait = () => {
  return `[⏳] Wait a moment...`
}
exports.done = () => {
  return `[☑️] Success!`
}
exports.kicking = () => {
  return `Kicking : `
}
exports.adding = () => {
  return `Adding : `
}
exports.demoting = () => {
  return `Demoting : `
}
exports.promoting = () => {
  return `Promoting : `
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
exports.onlyGroup = () => {
  return `[❕] This command can only be used in groups.`
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
exports.sizeMax = (url) => {
  `The file size is too large. Download the manual file in this link.\n*Link:* ${url}`
}

// Feature
exports.nsfwHasOn = () => {
  return `[❕] Nsfw has been active before.`
}
exports.nsfwOff = () => {
  return `[❕] Nsfw is not enabled.`
}
