export default class SemanticInterpreter {
	constructor() {
		this.errors = [];
    this.entities = [];
	}

	execute(ast) {
		this.errors = [];
    this.entities = [];
    console.log(ast)
		for (const node of ast) {
      if (this.errors.length > 0) return;

			switch (node.type) {
				case "entity":
					this._checkEntity(node);
					break;
				case "relationship":
					this._checkRelationship(node);
					break;
				case "attribute":
					this._checkAttribute(node);
					break;
				case "assentity":
					this._checkAssEntity(node);
					break;
				case "specialize":
					this._checkSpecialize(node);
					break;
			}
		}

		return {
			success: this.errors.length === 0,
			errors: this.errors,
		};
	}

	_checkEntity(node) {
    let attributes = [];
    if (this.entities.includes(node.name)) {
      this.errors.push({
        message: `Entity '${node.name}' is already defined`,
        node: node,
      });
      return;
    }

    this.entities.push(node.name);

    for (const attr of node.attributes) {
      if (attributes.includes(attr.name)) {
        this.errors.push({
          message: `Attribute '${attr.name}' is already defined in entity ${node.name}`,
          node: attr,
        });
        return;
      } 

      attributes.push(attr.name);
      this._checkAttribute(attr);
    }

  }
	
	_checkAttribute(node) {
    switch (node.type) {
      case "simple": break;
      case "id": break;
      case "composed": break;
    }
  }

  _checkRelationship(node) {}
	_checkAssEntity(node) {}
	_checkSpecialize(node) {}
}
