import net from 'net';

/**
 * Find an available port starting from the preferred port
 * @param {number} preferredPort - The preferred port to use
 * @returns {Promise<number>} - An available port
 */
export const findAvailablePort = (preferredPort) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, try the next port
        findAvailablePort(preferredPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });
    
    server.listen(preferredPort, () => {
      const { port } = server.address();
      server.close(() => {
        resolve(port);
      });
    });
  });
};

export default findAvailablePort; 