<img src="https://github.com/eebod/git-file-store/blob/main/Images/icon.png" align="right" />

# FTC MERGED README [![Awesome](https://cdn.jsdelivr.net/gh/sindresorhus/awesome@d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/eebod)

> 📚 How the Program Works

This Program uses nodejs https API to request [Midjourney's](https://midjourney.com/showcase/recent/) Webpage, pull out a section of the webpage and format it into JSON. It uses the fs API to download images directly from Midjourney's server locally, stores the prompt for each image in an array. The code picks 4 random image, there's a written utility function to do that.
<br><br>
Using Pupeteer's Package, the program head's to twitter login page and inputs the username and password. Twitter seems to randomly ask for number or twitter username when it observes unusual activities, there is a section of the code that looks out for that and provides number any time it does.
<br><br>
Once logged in, the program selects the downloaded image files, it also clicks around to type in the Tweet text and also the ALT for each image. The program tweets, then deletes the downloaded image files and exits.

## 🔦 In Action (Images)
<div align="center">
<img src="https://github.com/eebod/git-file-store/blob/main/Repo_Files/FTC-Merged/login-page.png"/><br>
<h4>Puppeteer launched and on the login webflow page.</h4>

<br><br>

<img src="https://github.com/eebod/git-file-store/blob/main/Repo_Files/FTC-Merged/filled-login.png"/><br>
<h4>Pupetter Page.type method fill in username and mail page form.</h4>

<br><br>

<img src="https://github.com/eebod/git-file-store/blob/main/Repo_Files/FTC-Merged/unusual.png"/><br>
<h4>Twitter sometimes notices unusual activities, the program handles it.</h4>

<br><br>

<img src="https://github.com/eebod/git-file-store/blob/main/Repo_Files/FTC-Merged/image%20with%20tweet.png"/><br>
<h4>Program chooses file, adds alt text.</h4>

<h4>IT <kbd>TWEETS</kbd></h4>

</div>

## ✍️ Get Started
- Clone the repo
- Install dependencies
```sh
npm install
```
- Create a (.env) file and fill in with login details(sample below)
```env
MAIL="abcd.efg@gmail.com"

KEY="password-or-key"

PHONE="08112345678"
```
⚠️ The phone should follow local entry, without the prefix of the country code.

## Contribute

Contributions are always welcome!

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)