const User = require('../users/users-model')
/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    next({ status: 401, message: `You shall not pass!`})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree(req, res, next) {
  User.findBy({ username: req.body.username })
    .then(users => {
      if (!users.length) {
        next()
      } else {
        next({ status: 422, message: `Username taken: ${req.body.username}` })
      }
    })
    .catch(err => {
      next(err)
    })
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
  User.findBy({ username: req.body.username })
    .then(users => {
      if (users.length) {
        req.user = users[0]
        next()
      } else {
        next({ status: 401, message: 'Invalid credentials' })
      }
    })
    .catch(err => {
      next(err)
    })
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
  if (req.body.password.length < 3 || !req.body.password) {
    next({ status: 422, message: 'Password must be longer than 3 chars' })
  } else {
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}