## Unmarked White Van
### Code Badges
[![Build Status](https://travis-ci.org/shrutijalewar/white-van.svg)](https://travis-ci.org/shrutijalewar/white-van)
[![Coverage Status](https://coveralls.io/repos/shrutijalewar/white-van/badge.png?branch=views)](https://coveralls.io/r/shrutijalewar/white-van?branch=views)
build status icon
coverage status icon

### Screenshots
![Image1](https://raw.githubusercontent.com/shrutijalewar/white-van/master/docs/screenshots/1.jpg)
![Image1](https://raw.githubusercontent.com/shrutijalewar/white-van/master/docs/screenshots/2.jpg)
![Image1](https://raw.githubusercontent.com/shrutijalewar/white-van/master/docs/screenshots/3.jpg)
![Image1](https://raw.githubusercontent.com/shrutijalewar/white-van/master/docs/screenshots/4.jpg)


### Description
write a description about your project

### Models
```
#User
- prop-username
- prop-email
- prop-password
- prop-phone
- prop-photo[]
- prop-loc
- prop-isSmoker
- prop-isRecord
- prop-WeaponOfChoice
- prop-Stalk[]
- prop-hookup[]
- prop-lookingFor
- .findById
- .register
- .authenticate
- .update
- .send
- .findStalked
- .findHookedUp
- .shank
- .stalk
- .querry
- .hookUp
```

#Message
- prop-senderId
- prop-receiverId
- prop-message
- prop-date
- prop-isRead
- .findByReceiverId
- .save
- .unread
- .send
- fn-iterator

#Gifts
- .all
- .findById
````
### Database
```
gifts
```
```
messages
```
```
users
```

### Features
- [x] Local Login, login(passport strategy)
- [x] Profile update, upload photos
- [x] Geo Coding
- [x] Email, texting and internal messagin
- [x] Send/ accept "hook-up requests"/ Send "Shank"(=facebook Poke)/Secretly "Stalk"profiles
- [x] Search through multiple categories at once
- [x] Make online purchases and send gifts

### Running Tests
```bash
$ npm install
$ npm test
```

### Contributors
- [Kayla Jones](https://github.com/kaylalynjones)
- [Brian Hiatt](https://github.com/bchiatt)
- [Liza Carter](https://github.com/LizaHCarter)

### License
[MIT](LICENSE)

