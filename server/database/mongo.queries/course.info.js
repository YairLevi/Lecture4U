const bcrypt = require('bcryptjs')


const before = '$2a$10$uuYNxr80nQuYhqLdveneu.mmLy8BxR5TUaNcA4MupDwnwihZlZQQm'
const password = 'a'

bcrypt.compare(password, before)
    .then(res => console.log(res))

