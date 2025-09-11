export default class SemanticInterpreter {
	constructor() {
		this.entities = [];
		this.relationships = [];
	}

	execute(ast) {
		this.entities = [];
		this.relationships = [];
    
    for (const node of ast) {
			switch (node.type) {
				case "entity":
					this._checkEntity(node);
					break;
				case "relationship":
					this._checkRelationship(node);
					break;
				case "assentity":
					this._checkAssEntity(node);
					break;
				case "specialize":
					this._checkSpecialize(node);
					break;
			}
		}
	}

	_checkEntity(node) {
		if (this.entities.find((et) => et.name === node.name)) {
			throw Error(`Entity '${node.name}' is already defined`);
		}

		let attributes = [];
		for (const attr of node.attributes) {
      
			if (attributes.find((att) => att.name === attr.name)) {
				throw Error(`Attribute '${attr.name}' is already defined in entity ${node.name}`);
			}

			attributes.push(attr);
			this._checkAttribute(attr);
		}
    
		if (!node.attributes.find((attr) => attr.type === "identifier")) {
      throw Error(`The entity '${node.name}' must have at least one identifier attribute`);
		}

		this.entities.push(node);
	}

	_checkAttribute(node) {
		if (node) {
			if (!["simple", "identifier", "composed"].includes(node.type)) {
        throw Error(`Attribute '${node.name}' must be of type simple, identifier or composed`);
			}
      
			let rep = []
      switch (node.type) {
				case "simple":
					break;
				case "identifier":
					break;
				case "composed":
          for (const attr of node.attributes) {
            if (rep.includes(attr.name)) throw Error(`Attribute '${attr.name}' is already defined in attribute composed ${node.name}`);
            rep.push(attr.name)
          }
					break;
			}
		}
	}

	_checkRelationship(node) {
    if (node.name == null) node.name = node.refs.map(item => item.name).join("-")

		if (this.relationships.find((rel) => rel.name === node.name)) {
      throw Error(`Relationship '${node.name}' is already defined`);
		}

		for (const re of node.refs) {
			if (!this.entities.find((et) => et.name === re.name)) {
        throw Error(`Entity '${re.name}' is not defined`);
			}
		}

		for (const att of node.attributes) {
			this._checkAttribute(att);
		}

		this.relationships.push(node);
	}

	_checkAssEntity(node) {
		if (!this.relationships.find((rel) => rel.name === node.relationship)) {
      throw Error(`Relationship '${node.relationship}' is not defined`);
		}

		const index = this.relationships.findIndex(
			(rel) => rel.name === node.relationship,
		);
		this.relationships[index].type = node.type;
	}
  
	_checkSpecialize(node) {}
}
