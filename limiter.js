
let ipRequestCounts = {};

let maxIpConnections = 10;
let maxIpRequestsPerMinute = 5;

// Reset request counts every minute
setInterval(() => {
    ipRequestCounts = {};
}, 60 * 1000);

function clientBlocked(io, currentSocket) {
    let ipCounts = getOverallIpConnectionCounts(io);
    let currentIp = getSocketIp(currentSocket);

    if (typeof currentIp !== 'string') {
        console.info('LIMITER: Failed to retrieve socket IP.');
        return false;
    }

    let currentIpConnections = ipCounts[currentIp] || 0;
    let currentIpRequests = ipRequestCounts[currentIp] || 0;

    ipRequestCounts[currentIp] = currentIpRequests + 1;

    if (currentIpConnections > maxIpConnections) {
        console.info(`LIMITER: Max connection count of ${maxIpConnections} exceeded for client ${currentIp}`);
        return true;
    }

    if (currentIpRequests > maxIpRequestsPerMinute) {
        console.info(`LIMITER: Max request count of ${maxIpRequestsPerMinute} exceeded for client ${currentIp}`);
        return true;
    }

    return false;
}

function getOverallIpConnectionCounts(io) {
    let ipCounts = {};

    io.of('/').sockets.forEach(socket => {
        let ip = getSocketIp(socket);
        if (ip) {
            if (!ipCounts[ip]) {
                ipCounts[ip] = 1;
            } else {
                ipCounts[ip] += 1;
            }
        }
    });

    return ipCounts;
}

function getSocketIp(socket) {
    // Prefer x-forwarded-for header if behind a proxy
    const forwardedFor = socket.handshake.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string') {
        return forwardedFor.split(',')[0].trim();
    }
    
    // Fallback to the direct connection address
    return socket.handshake.address;
}

module.exports = {
    clientBlocked
};
