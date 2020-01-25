export default function routerWrapper(Univ, parent) {
  const { Endpoint, Route } = Univ.adapter.Router;

  function routeShortcut(method, url, controller) {
    return Route(Univ, parent, {
      method,
      url,
      controller
    });
  }

  return {
    endpoint(url, callback) {
      Endpoint(parent, url, endpoint => {
        const wrapper = routerWrapper(Univ, endpoint);
        callback(wrapper);
      });
    },
    get(url, controller) {
      return routeShortcut("GET", url, controller);
    },
    post(url, controller) {
      return routeShortcut("POST", url, controller);
    },
    put(url, controller) {
      return routeShortcut("PUT", url, controller);
    },
    delete(url, controller) {
      return routeShortcut("DELETE", url, controller);
    },
    options(url, controller) {
      return routeShortcut("OPTIONS", url, controller);
    },
    head(url, controller) {
      return routeShortcut("HEAD", url, controller);
    },
    patch(url, controller) {
      return routeShortcut("PATCH", url, controller);
    }
  };
}
