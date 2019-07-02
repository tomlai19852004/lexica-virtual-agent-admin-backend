<img src="https://lexica.io/assets/images/Lexica_Logo.svg" alt="Lexica" />

## Introduction
This repository contains backend code for **Lexica virtual dialogue system admin portal**. 

## Prequisites
* Amazon Web Service
* MongoDB >= 3.6
* Node.js >= 10
* Typescript >= 3.5.1
* Docker >= 17.09
* docker-compose >= 1.17.1

## Getting Started
This backend is built on top of docker. Docker and docker-compose is required to run. In addition, there is a list of environment variable that this backend system uses. You need to create a .env with the following:

```
PORT=
MONGO_URL=
SCRYPT_N=
SCRYPT_R=
SCRYPT_P=
SCRYPT_SALT=
SCRYPT_KEYLEN=
JWT_KEY=
JWT_EXPIRE_SECOND=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_CHATBOT_S3_API_VERSION=
AWS_CHATBOT_S3_BUCKET=
AWS_CHATBOT_SES_API_VERSION=
AWS_CHATBOT_SES_REGION=
AWS_CHATBOT_SES_SENDER=
SUGGESTION_SERVER_URL=  
```

Once you have all the environment variable setup. Simply run the following command to start.
```
docker-compose up --build
```

## Licence
[MIT License](https://github.com/tomlai19852004/lexica-virtual-agent-admin-backend/blob/master/LICENSE.md)

## Contributing
Contributions are welcome!