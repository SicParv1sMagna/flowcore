export class GraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraphError";
  }
}

export class UnknownNodeError extends GraphError {
  constructor(node: string) {
    super(`Unknown node: ${node}`);
    this.name = "UnknownNodeError";
  }
}

export class EmptyGraphError extends GraphError {
  constructor() {
    super("Graph should contain at least one node");
    this.name = "EmptyGraphError";
  }
}

export class InvalidInitialNodeError extends GraphError {
  constructor(node: string) {
    super(`Initial node does not exist: ${node}`);
    this.name = "InvalidInitialNodeError";
  }
}
