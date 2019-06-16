import { seed, random, date, finance, name } from 'faker';
import { concat } from 'lodash';

import { SenderInfo } from 'lexica-dialog-model/dist/SenderInfo';

// tslint:disable max-line-length trailing-comma object-literal-key-quotes quotemark  prefer-array-literal

seed(987654321);
const fakeUserId = new Array(100).fill(1).map(v => String(finance.account()));

const fakeUser = [];
for (let i = 0; i < 100; i += 1) {
  fakeUser.push({
    "uni": "dev",
    "messenger": "FACEBOOK",
    "senderId": fakeUserId[i],
    "firstName": name.firstName(),
    "lastName": name.lastName(),
    "creationDate": date.past(),
    "lastUpdatedDate": date.recent(),
  });
}

export const senderInfo: any[] = concat(
  [
    {
      "_id": "5a1bcedcac017e4514ea28bb",
      "uni": "dev",
      "messenger": "FACEBOOK",
      "senderId": "1773795725979017",
      "firstName": "Lawrence",
      "middleName": "abc",
      "lastName": "Cheung",
      "creationDate": new Date("2017-10-11T12:44:36.754+08:00"),
      "lastUpdatedDate": new Date("2017-10-11T12:44:36.754+08:00"),
    },
    {
      "uni": "dev",
      "senderId": "1218519261609395",
      "messenger": "FACEBOOK",
      "firstName": "Linnovs",
      "lastName": "Liu",
      "creationDate": new Date("2017-10-17T13:24:21.000+08:00"),
      "lastUpdatedDate": new Date("2017-10-17T13:24:21.000+08:00"),
    },
    {
      "uni": "oth",
      "messenger": "FACEBOOK",
      "senderId": "1773795725979017",
      "firstName": "Lawrence",
      "lastName": "Cheung",
      "creationDate": new Date("2017-10-11T12:44:36.754+08:00"),
      "lastUpdatedDate": new Date("2017-10-11T12:44:36.754+08:00"),
    },
  ],
  fakeUser,
);
