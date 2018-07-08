export default function (io) {
    const nsp = io.of('/views');

    nsp.on('connect', (socket) => {
        socket.on('register', (view) => {
        });
    });
}
