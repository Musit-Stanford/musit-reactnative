import Realm from 'realm';

const userSchema = {
  name: 'User',
  properties: {
    name: 'string',
    imgURL: 'string',
    threadIDs: {type: 'list', objectType: 'User'},
    friendIDs: {type: 'list', objectType: 'User'},
  }
};

const recSchema = {
  name: 'Rec',
  properties: {
    threadID: 'string',
    timeSent: 'date',
    message: 'string',
    fromUser: 'User',
  }
};

const threadSchema = {
  name: 'Thread',
  properties: {
    name: 'string',
    users: {type: 'list', objectType: 'User'},
    adminID: 'string',
    recommendations:  {type: 'list', objectType: 'Rec'},
  }
};

let realm = new Realm({schema: [userSchema, recSchema, threadSchema]});

export default realm;