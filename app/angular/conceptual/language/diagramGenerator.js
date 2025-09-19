import dagre from "dagre";
import Factory from "../factory";
import * as joint from "jointjs/dist/joint";
import Linker from "../linker";

class DiagramGenerator {
	constructor(graph, factory, linker) {
		/** @type {joint.dia.Graph} */
		this.graph = graph;
		/** @type {Factory} */
		this.factory = factory;
		/** @type {Linker} */
		this.linker = linker;

		this.entities = new Map();
		this.relationships = new Map();
		this.assentity = new Map();
	}

	execute(ast) {
		this.graph.clear();

		ast.forEach((node) => {
			switch (node.type) {
				case "entity":
					this.createOrUpdateEntity(node);
					break;
				case "relationship":
					this.createOrUpdateRelationship(node);
					break;
				case "assentity":
					this.createRelationshipAssociative(node);
					break;
			}
		});
		this.applyLayout();
	}

	createOrUpdateEntity(node) {
		const entity = this.factory.createEntity({ position: { x: 125, y: 10 } });
		this.graph.addCell(entity);
		entity.attr("text/text", node.name);

		if (node.attributes && node.attributes.length > 0) {
			this.createOrUpdateAttributes(node, entity);
		}

		this.entities.set(node.name, entity);
	}

	createOrUpdateRelationship(node) {
		let rel;
		if (node.refs.length == 1) {
			const ent = this.entities.get(node.refs[0].name);
			const card = this.util_create_cardinality(node.refs[0].cardinality);

			rel = this.linker.addAutoRelationship({
				element: { model: ent },
			});
			rel.attr("text/text", node.name);
			const connectedLinks = this.graph.getConnectedLinks(rel);

			connectedLinks.forEach((link) => {
				link.label(0, { attrs: { text: { text: card } } });
			});
		} else {
			rel = this.factory.createRelationship({
				attrs: { text: { text: node.name } },
			});

			this.graph.addCell(rel);

			node.refs.forEach((entity) => {
				const ent = this.entities.get(entity.name);
				const ass = this.assentity.get(entity.name);
				const card = this.util_create_cardinality(entity.cardinality);

				if (ent || ass) {
					const link = this.linker.createLink(ent ?? ass, rel, this.graph);
					link.label(0, { attrs: { text: { text: card } } });
				}
			});
		}

		this.createOrUpdateAttributes(node, rel);
		this.relationships.set(node.name, rel);
	}

	createRelationshipAssociative(node) {
		const rel = this.relationships.get(node.relationship);
		if (rel !== null) {
			const block = this.factory.createBlockAssociative({});
			this.graph.addCell(block);

			block.embed(rel);
			rel.toFront();

			this.assentity.set(node.relationship, block);
		}
	}

	createOrUpdateAttributes(node, entity) {
		node.attributes.forEach((attr, _) => {
			let attribute = null;
			const card = this.util_create_cardinality(attr.cardinality);

			switch (attr.type) {
				case "identifier":
					attribute = this.factory.createKey({});
					break;
				case "simple":
				case "composed":
				case "composed_att":
					attribute = this.factory.createAttribute({
						cardinality: card,
					});
					break;
			}

			let name = attr.name;

			if (
				attr.cardinality &&
				(attr.cardinality.min !== "1" || attr.cardinality.max !== "1")
			)
				name += ` ${card}`;
			attribute.attr("text/text", name);

			this.graph.addCell(attribute);
			this.linker.createLink(attribute, entity, this.graph);

			if (attr.type === "composed") {
				attribute.set("composed", true);
				this.createOrUpdateAttributes(attr, attribute);
			}
		});
	}

	util_create_cardinality(cardinality) {
		if (cardinality) return `(${cardinality.min}, ${cardinality.max})`;
		return "(1, 1)";
	}

	applyLayout() {
		const cells = this.graph.getCells();
		const nodes = cells.filter(
			(c) => c.isElement() && !c.get("parent") && c != null,
		);
		const links = cells.filter((c) => c.isLink());

		const g = new dagre.graphlib.Graph();
		g.setGraph({ rankdir: "TB" });
		g.setDefaultEdgeLabel(() => ({}));

		nodes.forEach((n) => {
			const size = n.get("size");
			g.setNode(n.id, { width: size.width, height: size.height });
		});

		const virtualBlocks = new Map();
		this.assentity.forEach((block, relName) => {
			const blockSize = block.size();
			const virtualId = `block_${relName}`;
			g.setNode(virtualId, {
				width: blockSize.width,
				height: blockSize.height,
			});
			virtualBlocks.set(relName, virtualId);

			const rel = this.relationships.get(relName);
			const connectedLinks = this.graph.getConnectedLinks(rel);
			connectedLinks.forEach((link) => {
				const otherEl =
					link.getSourceElement() === rel
						? link.getTargetElement()
						: link.getSourceElement();
				if (otherEl) {
					g.setEdge(virtualId, otherEl.id);
				}
			});
		});

		links.forEach((l) => {
			g.setEdge(l.get("source").id, l.get("target").id);
		});

		dagre.layout(g);

		g.nodes().forEach((id) => {
			if (id.startsWith("block_")) return;
			const node = this.graph.getCell(id);
			const pos = g.node(id);
			if (node && pos) {
				node.position(
					pos.x - node.size().width / 2,
					pos.y - node.size().height / 2,
				);
			}
		});

		this.assentity.forEach((block, relName) => {
			const virtualId = virtualBlocks.get(relName);
			const pos = g.node(virtualId);
			if (block && pos) {
				block.position(
					pos.x - block.size().width / 2,
					pos.y - block.size().height / 2,
				);
				const rel = this.relationships.get(relName);
				if (rel) {
					rel.position(
						(block.size().width - rel.size().width) / 2,
						(block.size().height - rel.size().height) / 2,
						{ parentRelative: true },
					);
					rel.toFront();
				}
			}
		});
	}
}

export default DiagramGenerator;
