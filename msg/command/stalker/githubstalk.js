let axios = require('axios')
let fs = require("fs")

async function result(user) {
  return new Promise(async (resolve, reject) => {
    await axios.get("https://api.github.com/users/"+user)
      .then((web) => {
        hasil = web.data
        avatar = hasil.avatar_url
        bio = hasil.bio
        company = hasil.company
        email = hasil.email
        a1 = hasil.twitter_username
        a2 = hasil.public_repos
        a3 = hasil.public_gists
        a4 = hasil.followers
        a5 = hasil.following
        a6 = hasil.location
        a7 = hasil.type
        result = {
          avatar: avatar,
          bio: bio,
          company: company,
          email: email,
          twiter_username: a1,
          public_repo: a2,
          public_gists: a3,
          follower: a4,
          following: a5,
          location: a6,
          Type: a7
        }
        resolve(result)
      }).catch(reject)
  })
}

module.exports = { result }
