export const printRoutes = (stack: any, path: string = "") =>
  stack.forEach((layer: any) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(", ").toUpperCase();
      console.log(`Registered route: ${methods} ${path}${layer.route.path}`);
    } else if (layer.name === "router" && layer.handle.stack) {
      printRoutes(layer.handle.stack, `${path}${layer.regexp.source}`);
    }
  });
