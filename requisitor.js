const net = require('net');

const SERVER_IP = 'localhost';
const SERVER_PORT = 12345;

const client = new net.Socket();

client.connect(SERVER_PORT, SERVER_IP, () => {
    console.log('🚀 Conectado ao servidor de notificações!');

    const targetEmail = 'gustavocraft321@gmail.com'; 
    const status = '2'; 
    const message = `${targetEmail} ${status}`;

    client.write(message);

    console.log(`📨 Enviando comando: ${message}`);
});

client.on('data', (data) => {
    console.log(`📩 Resposta do servidor: ${data.toString()}`);
});

client.on('close', () => {
    console.log('🔌 Conexão com o servidor encerrada.');
});
