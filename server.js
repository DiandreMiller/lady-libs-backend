//server.js
require('dotenv').config();
const app = require('./app');
const  sequelize  = require('./config/database');

// ✅ Port setup
const PORT = process.env.PORT || 4848;

// ✅ Connect to database and start server
(async () => {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected successfully.');
  
      await sequelize.sync({ alter: false }); 
      // await sequelize.sync({ alter: true }); // When altering user
      console.log('✅ Database synchronized.');
  
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      process.exit(1);
    }
  })();