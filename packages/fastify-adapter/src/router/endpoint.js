export default function endpointRegistry(parent, url, callback) {
  return parent.register(
    function(endpoint, opts, done) {
      callback(endpoint);
      done();
    },
    { prefix: url }
  );
}
