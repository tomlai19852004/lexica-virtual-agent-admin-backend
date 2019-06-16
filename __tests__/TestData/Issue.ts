import { seed, random, date, finance } from 'faker';
import { concat } from 'lodash';
import { Issue, Status } from 'lexica-dialog-model/dist/Issue';

// tslint:disable max-line-length trailing-comma object-literal-key-quotes quotemark prefer-array-literal

seed(987654321);
const fakeUserId = new Array(100).fill(0).map(v => String(finance.account()));
seed(987654321);
const fakeIssueId = new Array(100).fill(0).map(v => require('crypto').createHash('md5').update(random.alphaNumeric(24)).digest('hex').slice(0, 24));

const fakeIssue = [];

for (let i = 0; i < 100; i += 1) {
  fakeIssue.push({
    "_id": fakeIssueId[i],
    "uni": "dev",
    "messenger": "FACEBOOK",
    "senderId": fakeUserId[i],
    "status": Status.OPEN,
    "openDate": date.past(),
    "lastUpdatedDate": date.recent(),
  });
}

export const issues: Issue[] = concat(
  [
    {
      "uni": "dev",
      "messenger": "FACEBOOK",
      "senderId": "1773795725979017",
      "status": Status.OPEN,
      "openDate": new Date("2017-09-13"),
      "lastUpdatedDate": new Date("2017-09-13"),
    },
    {
      "uni": "dev",
      "messenger": "FACEBOOK",
      "senderId": "1218519261609395",
      "status": Status.OPEN,
      "openDate": new Date("2017-11-23"),
      "lastUpdatedDate": new Date("2017-11-23"),
    },
    {
      "uni": "dev",
      "messenger": "FACEBOOK",
      "senderId": "1773795725979017",
      "status": Status.CLOSED,
      "openDate": new Date("2017-09-13"),
      "lastUpdatedDate": new Date("2017-09-13"),
    },
    {
      "uni": "dev",
      "messenger": "FACEBOOK",
      "senderId": "1773795725979017",
      "status": Status.CLOSED,
      "openDate": new Date("2017-09-13"),
      "closedDate": new Date("2017-09-13"),
      "lastUpdatedDate": new Date("2017-09-13"),
    },
  ],
  fakeIssue,
);
