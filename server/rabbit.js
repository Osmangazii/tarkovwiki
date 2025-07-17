const amqp = require('amqplib');

async function sendToQueue(queue, msg) {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue(queue);
  ch.sendToQueue(queue, Buffer.from(msg));
  setTimeout(() => { conn.close(); }, 500);
}

module.exports = { sendToQueue }; 