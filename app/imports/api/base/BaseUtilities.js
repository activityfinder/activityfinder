import { Interests } from '/imports/api/interest/InterestCollection';

export function removeAllEntities() {
  Interests.removeAll();
}
