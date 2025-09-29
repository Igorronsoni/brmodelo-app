export default class Transformation {
	execute(ast) {
		const model = {
      entities: {},
      relationships: {},
      assentities: {},
      specializes: {},
      notes: {}
    };

    for (const node of ast) {
      switch(node.type) {
        case "entity":
          model.entities[node.name] = node;
          break;
        case "relationship":
          model.relationships[node.name] = node;
          break;
        case "assentity":
          model.assentities[node.relationship] = node;
          break;
        case "specialize":
          model.specializes[node.ref.name] = node;
          break;
        case "note":
          model.notes[node.value] = node;
          break;
      }
    }

    return model;
  }
}
