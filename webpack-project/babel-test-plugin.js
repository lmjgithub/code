module.exports = function(babel) {
  return {
    visitor: {
      VariableDeclarator(path, state) {
        if (path.node.id.name == "a") {
          path.node.id = babel.types.identifier("b");
        }
      }
    }
  };
};
