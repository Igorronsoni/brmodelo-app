export default class SemanticInterpreter {
	constructor() {
		this.errors = [];
		this.entities = [];
		this.relationships = [];
	}

	execute(ast) {
		this.errors = [];
		this.entities = [];
		this.relationships = [];

		console.log(this.relationships, this.entities);
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
		if (this.entities.find((et) => et.name === node.name)) {
			this.errors.push({
				message: `Entity '${node.name}' is already defined`,
				node: node,
			});
			return;
		}

		let attributes = [];
		for (const attr of node.attributes) {
			if (attributes.find((att) => att.name === attr.name)) {
				this.errors.push({
					message: `Attribute '${attr.name}' is already defined in entity ${node.name}`,
					node: attr,
				});
				return;
			}

			attributes.push(attr);
			this._checkAttribute(attr);
		}

		if (!node.attributes.find((attr) => attr.type === "id")) {
			this.errors.push({
				message: `The entity '${node.name}' must have at least one 'id' attribute`,
				node: node,
			});
		}

    this.entities.push(node);
	}

	_checkAttribute(node) {
		if (node) {
			if (!["simple", "id", "composed"].includes(node.type)) {
				this.errors.push({
					message: `Attribute '${node.name}' must be of type simple, id or composed`,
					node: node,
				});
				return;
			}

			switch (node.type) {
				case "simple":
					break;
				case "id":
					break;
				case "composed":
					break;
			}
		}
	}

	_checkRelationship(node) {
		if (this.relationships.find((rel) => rel.name === node.name)) {
			this.errors.push({
				message: `Relationship '${node.name}' is already defined`,
				node: node,
			});
			return;
		}

		for (const re of node.refs) {
			if (!this.entities.find((et) => et.name === re.name)) {
				this.errors.push({
					message: `Entity '${re.name}' is not defined`,
					node: node,
				});
				return;
			}
		}
    
		for (const att of node.attributes) {
			this._checkAttribute(att);
		}

		this.relationships.push(node);
	}

	_checkAssEntity(node) {
		if (!this.relationships.find((rel) => rel.name === node.relationship)) {
			this.errors.push({
				message: `Relationship '${node.relationship}' is not defined`,
				node: node,
			});
			return;
		}

		const index = this.relationships.findIndex(
			(rel) => rel.name === node.relationship,
		);
		this.relationships[index].type = node.type;
	}
	_checkSpecialize(node) {}
}
