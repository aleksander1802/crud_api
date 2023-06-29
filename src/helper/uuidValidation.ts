import { parse as parseUUID } from 'uuid';

export const isValidUUID = (uuid: string): boolean => {
  try {
    parseUUID(uuid);
    return true;
  } catch (error) {
    return false;
  }
};
