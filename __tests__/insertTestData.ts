import {
  issueRepository,
  configRepository,
  messageRepository,
  userRepository,
  intentRepository,
  senderInfoRepository,
  requestResponseMappingRepository,
} from 'lexica-dialog-repository';
import * as mongoose from 'mongoose';
import {
  users,
  intents,
  issues,
  messages,
  configs,
  senderInfo,
  mappings,
} from './TestData';

const { DROP_DB } = process.env;

const repositories = [
  userRepository,
  intentRepository,
  issueRepository,
  messageRepository,
  configRepository,
  senderInfoRepository,
  requestResponseMappingRepository,
];

export async function createTestData(url: any) {
  (<any>mongoose).Promise = global.Promise;
  await mongoose.connect(url);

  if (DROP_DB === 'true') {
    await mongoose.connection.dropDatabase();
  }

  await Promise.all(repositories.map(repository => repository.removeAll()));
  await Promise.all(repositories.map(repository => repository.isIndexed()));

  await Promise.all(users.map(async s => userRepository.create(s)));
  await Promise.all(intents.map(async s => intentRepository.create(s)));
  await Promise.all(senderInfo.map(async s => senderInfoRepository.create(s)));
  await Promise.all(issues.map(async s => issueRepository.create(s)));
  await Promise.all(messages.map(async s => messageRepository.create(s)));
  await Promise.all(configs.map(async s => configRepository.create(s)));
  await Promise.all(mappings.map(async s => requestResponseMappingRepository.create(s)));

  await mongoose.connection.close();
}
