# QR File Sharing (Client)

An app for easy file sharing between your PC and phone.

For the API go [here](https://github.com/gizinski-jacek/qr-file-share-api).

## Table of contents

- [QR File Sharing (Client)](#qr-file-sharing-client)
  - [Table of contents](#table-of-contents)
- [Github \& Live](#github--live)
  - [Getting Started](#getting-started)
  - [React](#react)
  - [Deploy](#deploy)
  - [Features](#features)
  - [Status](#status)
  - [Contact](#contact)

# Github & Live

Github repo can be found [here](https://github.com/gizinski-jacek/fia-decisions).

API worker repo can be found [here](https://github.com/gizinski-jacek/qr-file-share-api).

Live demo can be found on [Vercel](https://qr-file-share-umber.vercel.app).

## Getting Started

Install all dependancies by running:

```bash
npm install
```

In the project root directory run the app with:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
The page will reload if you make edits.\
You will also see any lint errors in the console.

Build the app for production to the `build` folder with:

```bash
npm run build
```

It correctly bundles React in production mode and optimizes the build for the best performance.\
The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## React

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/docs).

Don't forget to add **.env** file with these environment variables for the app:

```
REACT_APP_CLIENT_URI
REACT_APP_API_URI
```

## Features

- Easy way to share files via 3 methods:
  - "Send" page for uploading files, generating QR code to scan and directly download files with your phone
  - "Receive" page generating QR code to scan with your phone to redirect user to shared folder
  - "Code" input box or page allowing user to access existing folder with uploaded files or creating new folder if it does not exist
- All folders with its files are periodically deleted

## Status

Project status: **_FINISHED_**

## Contact

Feel free to contact me at:

```
gizinski.jacek.tr@gmail.com
```
