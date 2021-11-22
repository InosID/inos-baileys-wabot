// Actions
exports.wait = () => {
  return
    `[⏳] Wait a moment...`
}

// Permission
exports.notAllowed = () => {
  return
    `[❕] This command is not permitted by the owner.`
}

// Require
exports.needQuery = () => {
  return
    `[❕] Query parameters not found.`
}
