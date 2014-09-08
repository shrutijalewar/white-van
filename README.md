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

## Unmarked White Van
### Description
Are you lonely, looking for love, companionship and have a fetish for killing people? Then look no further, this is a dating website made especially for serial killers. Feel free to air your skeletons from the closet (literally or figuratively) in the company that you can gel well with. Feel free to stalk, shank and hookup with others from the safety and convenience of your home...
##It really is as simple as that or is it?? There is only one way to find out...
###Come hop in the unmarked white van for free candy!


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

