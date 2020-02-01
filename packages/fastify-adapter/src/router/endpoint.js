export default function endpointRegistry(Univ, { parent, url }, callback) {
  return parent.register(
    function(endpoint, opts, done) {
      callback(endpoint, Univ);
      done();
    },
    { prefix: url }
  );
}
