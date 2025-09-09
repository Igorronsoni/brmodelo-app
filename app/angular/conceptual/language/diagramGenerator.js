import * as joint from "jointjs/dist/joint";
import dagre from "dagre";

class DiagramGenerator {
	constructor(graph, shapeFactory, paper) {
		this.graph = graph;
		this.shapeFactory = shapeFactory;
		this.paper = paper;
	}

	generate(ast) {
		this.graph.clear();
		ast.forEach((node) => {
			switch (node.type) {
				case "entity":
					this.createOrUpdateEntity(node);
					break;
				case "relationship":
					this.createOrUpdateRelationship(node);
					break;
			}
		});
		this.applyLayout();
	}

	createOrUpdateEntity(node) {
		let entity = this.graph
			.getCells()
			.find(
				(c) =>
					c.get("type") === "erd.Entity" && c.attr("text/text") === node.name,
			);

		if (!entity) {
			entity = this.shapeFactory.createEntity({});
			this.graph.addCell(entity);
			entity.attr("text/text", node.name);
		}

		if (node.attributes && node.attributes.length > 0) {
			this.createOrUpdateAttributes(node, entity);
		}
	}

	createOrUpdateRelationship(node) {
		let rel = this.graph
			.getCells()
			.find(
				(c) =>
					c.get("type") === "erd.Relationship" &&
					c.attr("text/text") === node.name,
			);

		if (!rel) {
			rel = this.shapeFactory.createRelationship({});
			this.graph.addCell(rel);
		}

		rel.attr("text/text", node.name);

		node.entities.forEach((entName) => {
			const ent = this.existing[entName];
			if (ent) {
				const link = new joint.dia.Link({
					source: { id: ent.id },
					target: { id: rel.id },
				});
				this.graph.addCell(link);
			}
		});
	}

	createOrUpdateAttributes(node, entity) {
		node.attributes.forEach((attr, _) => {
			let attribute = null;

			switch (attr.type) {
				case "identifier":
					attribute = this.shapeFactory.createKey({});
					break;
				case "simple":
					attribute = this.shapeFactory.createAttribute({
						cardinality: `(${attr.cardinality.min}, ${attr.cardinality.max})`,
					});
					break;
				case "composed":
				case "composed_att":
					attribute = this.shapeFactory.createAttribute({});
					break;
			}

			let name = attr.name;
			if (
				attr.cardinality &&
				(attr.cardinality.min !== "1" || attr.cardinality.max !== "1")
			)
				name += ` (${attr.cardinality.min}, ${attr.cardinality.max})`;
			attribute.attr("text/text", name);
			this.graph.addCell(attribute);
      
			const link = this.shapeFactory.createLink({
        source: { id: attribute.id },
				target: { id: entity.id },
			});
			this.graph.addCell(link);
      
      if (attr.type === "composed") {
        attribute.set("composed", true)
        this.createOrUpdateAttributes(attr, attribute)
      }
		});
	}

	applyLayout() {
		const cells = this.graph.getCells();
		const nodes = cells.filter((c) => c.isElement());
		const links = cells.filter((c) => c.isLink());

		const g = new dagre.graphlib.Graph();
		g.setGraph({ rankdir: "LR" });
		g.setDefaultEdgeLabel(() => ({}));

		nodes.forEach((n) => {
			const size = n.get("size");
			g.setNode(n.id, { width: size.width, height: size.height });
		});

		links.forEach((l) => {
			g.setEdge(l.get("source").id, l.get("target").id);
		});

		dagre.layout(g);

		let minX = Infinity,
			minY = Infinity;
		g.nodes().forEach((id) => {
			const pos = g.node(id);
			minX = Math.min(minX, pos.x);
			minY = Math.min(minY, pos.y);
		});

		const offsetX = 50 - minX;
		const offsetY = 50 - minY;

		g.nodes().forEach((id) => {
			const node = this.graph.getCell(id);
			const pos = g.node(id);
			if (node) {
				node.position(
					pos.x - node.size().width / 2 + offsetX,
					pos.y - node.size().height / 2 + offsetY,
				);
			}
		});
	}
}

export default DiagramGenerator;
