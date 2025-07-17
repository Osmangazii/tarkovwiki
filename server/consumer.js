const amqp = require('amqplib');

async function consume() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  await ch.assertQueue('test_queue');
  ch.consume('test_queue', msg => {
    if (msg !== null) {
      console.log('Kuyruktan mesaj alındı:', msg.content.toString());
      ch.ack(msg);
    }
  });
}

consume(); 