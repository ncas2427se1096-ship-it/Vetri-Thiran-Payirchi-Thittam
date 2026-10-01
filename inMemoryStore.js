const bcrypt = require('bcryptjs');

const users = [];
const favorites = [];
const weatherHistory = [];
const aiInsights = [];
const notifications = [];

// Seed initial in-memory admin & test user
(async () => {
  const adminSalt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('adminpassword123', adminSalt);
  users.push({
    _id: 'mem_admin_1',
    name: 'System Admin',
    email: 'admin@weatherwise.com',
    password: adminPass,
    role: 'admin',
    preferences: { tempUnit: 'C', notificationsEnabled: true, defaultCity: 'London' },
    createdAt: new Date(),
  });

  const userSalt = await bcrypt.genSalt(10);
  const userPass = await bcrypt.hash('userpassword123', userSalt);
  users.push({
    _id: 'mem_user_1',
    name: 'John Weather',
    email: 'user@weatherwise.com',
    password: userPass,
    role: 'user',
    preferences: { tempUnit: 'C', notificationsEnabled: true, defaultCity: 'Paris' },
    createdAt: new Date(),
  });
})();

module.exports = {
  users,
  favorites,
  weatherHistory,
  aiInsights,
  notifications,
};
