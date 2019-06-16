import { range } from 'lodash';
import { seed, random, lorem, finance } from 'faker';
import { ResponseType } from 'lexica-dialog-model/dist/Intent';
import { Message, MessageType, RequestType } from 'lexica-dialog-model/dist/Message';

// tslint:disable max-line-length trailing-comma object-literal-key-quotes quotemark prefer-array-literal
export const messages: any[] = range(1000).map((i) => {
  const date = new Date(`2017-09-13T10:25:55.951Z`);
  date.setTime(date.getTime() + (i * 60 * 60 * 1000));
  return {
    "uni": "dev",
    "rawRequest": {
      "entry": [
        {
          "messaging": [
            {
              "message": {
                "text": "can you show me how to borrow books and how to renew books please",
                "seq": 816,
                "mid": "mid.$cAADdGZDMiJ1krAtZI1eesYNajU3y"
              },
              "timestamp": 1505298354467.0,
              "recipient": {
                "id": "243102522839350"
              },
              "sender": {
                "id": "1773795725979017"
              }
            }
          ],
          "time": 1505298354506.0,
          "id": "243102522839350"
        }
      ],
      "object": "page"
    },
    "messenger": "FACEBOOK",
    "senderId": "1773795725979017",
    "sessionId": "d356c13e-5d09-495d-9297-951a656ee6ac",
    "issueId": "266061ba-0558-4a1d-a011-46866d45ba25",
    "type": MessageType.REQUEST,
    "date": date,
    "request": {
      "type": RequestType.TEXT,
      "message": "can you show me how to borrow books and how to renew books please.",
    },
    "commands": [
      "CIRCULATION BORROW_PRIVILEGE",
      "PHOTOCOPYING_WHAT"
    ],
    ...(() => {
      if (random.boolean() === true) {
        return {
          comment: {
            rating: random.number({ min: 1, max: 5 }),
          }
        };
      }

      return {
        comment: {
          newType: true,
        }
      };
    })()
  };
});

messages.push(...range(1000).map((i) => {
  const date = new Date(`2017-09-13T10:25:58.951Z`);
  date.setTime(date.getTime() + (i * 60 * 60 * 1000));
  return {
    "uni": "dev",
    "type": "RESPONSE",
    "messenger": "FACEBOOK",
    "senderId": "1773795725979017",
    "sessionId": Math.round(Math.random() * 10 + 1) % 2 === 0 ? "19681d79-2ebb-4be0-a4b1-5fbcd9df62c6" : undefined,
    "date": date,
    "response": {
      "type": "TEXT",
      "message": "Hi! I am Lexica. How can I help you?",
      "items": [],
      "options": []
    },
    "rawResponse": {
      "message": {
        "text": "Hi! I am Lexica. How can I help you?"
      },
      "recipient": {
        "id": "1508651612532871"
      }
    },
    "commands": [],
    "__v": 0
  };
}));

messages.push({
  "uni": "dev",
  "rawRequest": {
    "entry": [
      {
        "messaging": [
          {
            "message": {
              "text": "can you show me how to borrow books and how to renew books please",
              "seq": 816,
              "mid": "mid.$cAADdGZDMiJ1krAtZI1eesYNajU3y"
            },
            "timestamp": 1505298354467.0,
            "recipient": {
              "id": "243102522839350"
            },
            "sender": {
              "id": "1773795725979017"
            }
          }
        ],
        "time": 1505298354506.0,
        "id": "243102522839350"
      }
    ],
    "object": "page"
  },
  "messenger": "FACEBOOK",
  "senderId": "1218519261609395",
  "sessionId": "d356c13e-5d09-495d-9297-951a656ee6ac",
  "issueId": "266061ba-0558-4a1d-a011-46866d4sba25",
  "type": MessageType.REQUEST,
  "date": new Date(),
  "request": {
    "type": RequestType.TEXT,
    "message": "can you show me how to borrow books and how to renew books please",
  },
  "commands": [
    "CIRCULATION BORROW_PRIVILEGE",
    "PHOTOCOPYING_WHAT"
  ],
});

seed(987654321);
const fakeUserId = new Array(100).fill(0).map(v => String(finance.account()));
seed(987654321);
const fakeIssue = new Array(100).fill(0).map(v => require('crypto').createHash('md5').update(random.alphaNumeric(24)).digest('hex').slice(0, 24));

for (let i = 0; i < 100; i += 1) {
  const msg = lorem.sentences();
  messages.push({
    "uni": "dev",
    "rawRequest": {
      "entry": [
        {
          "messaging": [
            {
              "message": {
                "text": msg,
                "seq": 816,
                "mid": "mid.$cAADdGZDMiJ1krAtZI1eesYNajU3y"
              },
              "timestamp": 1505298354467.0,
              "recipient": {
                "id": "243102522839350"
              },
              "sender": {
                "id": "1773795725979017"
              }
            }
          ],
          "time": 1505298354506.0,
          "id": "243102522839350"
        }
      ],
      "object": "page"
    },
    "messenger": "FACEBOOK",
    "senderId": fakeUserId[i],
    "sessionId": random.uuid(),
    "issueId": fakeIssue[i],
    "type": MessageType.REQUEST,
    "date": new Date(),
    "request": {
      "type": RequestType.TEXT,
      "message": msg,
    },
    "commands": [
      "CIRCULATION BORROW_PRIVILEGE",
      "PHOTOCOPYING_WHAT"
    ],
  });
}

messages.push({
  "_id": "5a17c0a57f077d30aae8118d",
  "uni": "dev",
  "rawRequest": {
    "fileContentType": "image/png",
    "fileStoredPath": "e84bcda1-4e8f-494a-b49b-b68bc63986d3",
    "senderId": "123456",
    "fileUrl": "http://www.duluthnewstribune.com/sites/all/themes/fcc_basetheme/images/image-info.png",
    "locale": "en-GB",
    "type": "IMAGE"
  },
  "date": new Date(),
  "messenger": "echo",
  "senderId": "1773795725979017",
  "sessionId": "d356c13e-5d09-495d-9297-951a656ee6ac",
  "issueId": "266061ba-0558-4a1d-a011-46866d45ba25",
  "type": "REQUEST",
  "request": {
    "type": "IMAGE",
    "path": "e84bcda1-4e8f-494a-b49b-b68bc63986d3",
    "contentType": "image/png",
  },
  "commands": [],
});

messages.push({
  "_id": "5a1ccf38963b253062d663f5",
  "uni": "dev",
  "rawRequest": {
    "fileContentType": "image/png",
    "fileStoredPath": "e84bcda1-4e8f-494a-b49b-b68bc63986d3",
    "senderId": "123456",
    "fileUrl": "http://www.duluthnewstribune.com/sites/all/themes/fcc_basetheme/images/image-info.png",
    "locale": "en-GB",
    "type": "IMAGE"
  },
  "date": new Date(),
  "messenger": "echo",
  "senderId": "1773795725979017",
  "sessionId": "d356c13e-5d09-495d-9297-951a656ee6ac",
  "issueId": "266061ba-0558-4a1d-a011-46866d45ba25",
  "type": "REQUEST",
  "request": {
    "type": "IMAGE",
    "path": "test.jpg",
    "contentType": "image/png",
  },
  "commands": [],
});

messages.push({
  "_id": "5a1d04090ec0f3b7d3506cb1",
  "uni": "dev",
  "rawRequest": {
    "fileContentType": "image/png",
    "fileStoredPath": "e84bcda1-4e8f-494a-b49b-b68bc63986d3",
    "senderId": "123456",
    "fileUrl": "http://www.duluthnewstribune.com/sites/all/themes/fcc_basetheme/images/image-info.png",
    "locale": "en-GB",
    "type": "IMAGE"
  },
  "date": new Date(),
  "messenger": "echo",
  "senderId": "1773795725979017",
  "sessionId": "d356c13e-5d09-495d-9297-951a656ee6ac",
  "issueId": "266061ba-0558-4a1d-a011-46866d45ba25",
  "type": "REQUEST",
  "request": {
    "type": "AUDIO",
    "path": "voice.mp3",
    "contentType": "audio/mp3",
  },
  "commands": [],
});

messages.push({
  "_id": "5a573895c5c0923259e8d973",
  "uni": "dev",
  "rawRequest": {
    "entry": [
      {
        "messaging": [
          {
            "message": {
              "text": "can you show me how to borrow books and how to renew books please",
              "seq": 816,
              "mid": "mid.$cAADdGZDMiJ1krAtZI1eesYNajU3y"
            },
            "timestamp": 1505298354467.0,
            "recipient": {
              "id": "243102522839350"
            },
            "sender": {
              "id": "1773795725979017"
            }
          }
        ],
        "time": 1505298354506.0,
        "id": "243102522839350"
      }
    ],
    "object": "page"
  },
  "messenger": "FACEBOOK",
  "senderId": "1773795725979017",
  "sessionId": "d356c13e-5d09-495d-9297-951a656ee6ac",
  "issueId": "266061ba-0558-4a1d-a011-46866d45ba25",
  "type": MessageType.REQUEST,
  "date": new Date(),
  "request": {
    "type": RequestType.TEXT,
    "message": "can you show me how to borrow books and how to renew books please",
  },
  "commands": [
    "CIRCULATION BORROW_PRIVILEGE",
    "PHOTOCOPYING_WHAT"
  ],
});

messages.push({
  "_id": "5a5738cac5c0923259e8d974",
  "uni": "dev",
  "type": "RESPONSE",
  "messenger": "FACEBOOK",
  "senderId": "1773795725979017",
  "sessionId": Math.round(Math.random() * 10 + 1) % 2 === 0 ? "19681d79-2ebb-4be0-a4b1-5fbcd9df62c6" : undefined,
  "date": new Date(),
  "response": {
    "type": "TEXT",
    "message": "Hi! I am Lexica. How can I help you?",
    "items": [],
    "options": []
  },
  "rawResponse": {
    "message": {
      "text": "Hi! I am Lexica. How can I help you?"
    },
    "recipient": {
      "id": "1508651612532871"
    }
  },
  "commands": [],
  "__v": 0
});
