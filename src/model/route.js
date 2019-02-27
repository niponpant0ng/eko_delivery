class Route {
  constructor() {
    this.edges = {};
    this.nodes = new Set();
  }

  getNodes() {
    return [ ...this.nodes ]
  }

  addNode(node) {
    this.nodes.add(node);
    this.edges[node] = this.edges[node] || [];
  }

  addEdge(node1, node2, weight = 1) {
    this.edges[node1].push({ node: node2, weight: weight });
  }

  adjacent(node) {
    return this.edges[node]
  }
}

module.exports = Route