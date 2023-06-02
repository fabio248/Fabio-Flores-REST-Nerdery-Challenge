import { getEmail, getPassword } from './generate';

const mockConfig = {
  smtp: {
    email: getEmail,
    password: getPassword,
  },
};

export default mockConfig;
