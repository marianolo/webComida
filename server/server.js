const app = require('./app');
const { syncDB } = require('./models');

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  await syncDB();
});
