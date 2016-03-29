import DS from 'ember-data';
import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  normalizeResponse(store, type, data, id, requestType) {
    if (requestType === 'findAll') {
      return this.normalizeSearchResponse('resource', data);
    } else if (requestType === 'findRecord') {
      return this.normalizeSingleResponse('response', data);
    }
  },

  normalizeSearchResponse(type, data) {
    return {
      data: data.documents.map(resource => this.normalize(type, resource))
    };
  },

  normalizeSingleResponse(type, data) {
    let predicates = data.content && data.content.attributes ?
      data.content.attributes.map(attr => ({
        type: 'predicate',
        id: attr.id,
        attributes: attr,
        resource: encodeURIComponent(data.id)
      })) : [];

    let resAsJSONAPI = {
      data: this.normalize(type, data),
      included: predicates
    };

    return resAsJSONAPI;
    // this._super(type, resAsJSONAPI);
  },

  normalize(type, hash) {
    let relationships = hash.content && hash.content.attributes ?
      {
        predicates: {
          data: hash.content.attributes.map(attr => ({ type: 'predicate', id: attr.id}))
        }
      } : {};

    return {
      type: 'resource', // or type.modelName
      id: encodeURIComponent(hash.id),
      attributes: hash,
      relationships: relationships,
    };
  }
});


// {
//   "id": "http://localhost:8080/api/doc/2",
//   "dateTime": "Tue, 29 Mar 2016 00:43:44 GMT",
//   "createdDate": 1459212224352,
//   "title": "Honolulu",
//   "documentType": "object",
//   "cannotDisplay": false,
//   "content": {
//     "attributes": [
//       {
//         "id": "schema:name",
//         "name": "schema:name",
//         "resourceId": "http://localhost:8080/api/doc/2",
//         "type": "text",
//         "values": [
//           {
//             "id": "0",
//             "resourceId": "http://localhost:8080/api/doc/2",
//             "attributeId": "schema:name",
//             "data": "Honolulu",
//             "feedbackSummary": {
//               "numberComments": 0,
//               "numberRatings": 0
//             },
//             "microdata": {
//               "transactionStartId": "1"
//             }
//           },
//           {
//             "id": "1",
//             "resourceId": "http://localhost:8080/api/doc/2",
//             "attributeId": "schema:name",
//             "data": "Honolulu",
//             "feedbackSummary": {
//               "numberComments": 0,
//               "numberRatings": 0
//             },
//             "microdata": {
//               "transactionStartId": "1"
//             }
//           }
//         ]
//       },
//       ...
//     ],
//     "objectSummary": {
//       "numAttachments": 0,
//       "numComments": 0
//     }
//   },
//   "communityTags": [
//     "test"
//   ],
//   "personalTags": [
//     "test"
//   ],
//   "versionTimestamp": 1459212224000,
//   "timemap": [
//     {
//       "href": "http://localhost:8080/api/doc/2",
//       "rel": "original timegate"
//     },
//     {
//       "href": "http://localhost:8080/api/doc/2?timestamp=1459212224352",
//       "rel": "memento",
//       "dateTime": "Tue, 29 Mar 2016 00:43:44 GMT",
//       "count": "7"
//     }
//   ]
// }
