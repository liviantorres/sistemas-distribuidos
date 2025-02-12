const net = require('net');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'notify.cake@gmail.com', 
        pass: 'rsax hdbj xmvh gulf'  
    }
});


const getEmailMessage = (status) => {
    switch (status) {
        case '0':
            return {
                subject: '📌 Pedido Pendente',
                text: `Olá! 😊\n\nRecebemos seu pedido e ele está atualmente *PENDENTE*. 🔄\nEstamos processando sua solicitação e logo teremos novidades para você! 🚀\n\nObrigado por escolher nossos serviços!\n\n🔔 Fique de olho no seu e-mail para futuras atualizações.`
            };
        case '1':
            return {
                subject: '✅ Pedido Confirmado!',
                text: `🎉 Parabéns! Seu pedido foi *CONFIRMADO*! ✅\n\nEstamos organizando tudo para que sua experiência seja incrível. 🛍️\nAguarde que em breve você receberá mais detalhes sobre o envio. 📦\n\nSe precisar de algo, estamos à disposição!\n\n📩 Obrigado pela confiança!`
            };
        case '2':
            return {
                subject: '❌ Pedido Cancelado',
                text: `Olá! 😕\n\nInfelizmente, seu pedido foi *CANCELADO*. ❌\nSe isso foi um engano ou se precisar de ajuda, entre em contato com a nossa equipe de suporte. 📞💬\n\nEsperamos poder atendê-lo em breve!\n\nAtenciosamente,\n📌 Equipe de Atendimento`
            };
        case '3':
            return {
                subject: '👨‍🍳 Pedido em Preparação!',
                text: `Oi! Seu pedido está *EM PREPARAÇÃO*! 👨‍🍳🔥\n\nNossa equipe já está cuidando de tudo com carinho para garantir que seu pedido chegue perfeito! 🛠️📦\n\nAssim que estiver pronto para envio, avisaremos você. Fique de olho no seu e-mail! 📩\n\nObrigado pela paciência e pela preferência! 💙`
            };
        case '4':
            return {
                subject: '💳 Pagamento Efetuado com Sucesso!',
                text: `🎉 Pagamento aprovado! Seu pedido está sendo processado. ✅\n\nAgora é só aguardar enquanto preparamos tudo para envio! 📦🚀\n\nSe tiver alguma dúvida, estamos à disposição! Obrigado pela confiança. 💙`
            };
        case '5':
            return {
                subject: '⚠️ Pagamento Cancelado!',
                text: `Olá! 😕\n\nDetectamos que o *pagamento do seu pedido foi cancelado*. ❌\nIsso pode ter ocorrido por falta de saldo, erro no cartão ou cancelamento manual.\n\nSe precisar de ajuda ou quiser tentar novamente, entre em contato conosco! 📞💬\n\nAtenciosamente,\n📌 Equipe de Atendimento`
            };
        default:
            return null;
    }
};


const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: '"📨 Cakes" <notify.cake@gmail.com>',
            to: to,
            subject: subject,
            text: text
        });

        console.log(`✅ E-mail enviado para ${to}: ${info.response}`);
    } catch (error) {
        console.error(`⚠️ Erro ao enviar e-mail para ${to}:`, error);
    }
};


const SERVER_PORT = 12345;
const SERVER_IP = '0.0.0.0';

const server = net.createServer((socket) => {
    console.log(`🔗 Nova conexão recebida!`);

    socket.on('data', (data) => {
        const message = data.toString().trim();
        console.log(`📥 Mensagem recebida: ${message}`);

        const parts = message.split(' ');

        if (parts.length !== 2) {
            socket.write(`⚠️ Formato inválido! Use: email@dominio.com [0|1|2]\n`);
            return;
        }

        const targetEmail = parts[0];
        const status = parts[1];

        const emailContent = getEmailMessage(status);
        if (!emailContent) {
            socket.write(`🚨 Status inválido! Use 0️⃣ (Pendente), 1️⃣ (Confirmado) ou 2️⃣ (Cancelado).\n`);
            return;
        }

        sendEmail(targetEmail, emailContent.subject, emailContent.text);
        socket.write(`✅ Notificação enviada para ${targetEmail} com status ${status}!\n`);
    });

    socket.on('end', () => {
        console.log(`🔌 Cliente desconectado.`);
    });
});


server.listen(SERVER_PORT, SERVER_IP, () => {
    console.log(`🚀 Servidor de Notificações rodando na porta ${SERVER_PORT}`);
});
