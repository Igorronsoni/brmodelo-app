import dagre from "dagre";
import Factory from "../factory";
import * as joint from "jointjs/dist/joint";
import Linker from "../linker";
import Validator from "../validator";

class DiagramGenerator {
	constructor(graph, factory, linker, validator) {
		/** @type {joint.dia.Graph} */
		this.graph = graph;
		/** @type {Factory} */
		this.factory = factory;
		/** @type {Linker} */
		this.linker = linker;
		/** @type {Validator} */
		this.validator = validator;

		this.elements = null;
		this.currentModel = null;
	}

	setStructure(model, elements) {
		this.currentModel = model ?? {
			entities: {},
			relationships: {},
			assentities: {},
			specializes: {},
			notes: {},
		};

		this.elements = new Map(elements);
	}

	execute(newModel) {
		if (!this.currentModel || !this.elements) return;

		const diffs = this._diffModels(this.currentModel, newModel);

    for (const item of diffs.removed) this._removeElement(item);
		for (const item of diffs.added) this._addElement(item);
		for (const item of diffs.updated) this._updateElement(item);

		this.currentModel = JSON.parse(JSON.stringify(newModel));
		this._cleanupOrphans();
		this.applyLayout();

		return { model: this.currentModel, elements: this.elements };
	}

	_diffModels(oldModel, newModel) {
		const added = [];
		const removed = [];
		const updated = [];

		const compareCategory = (category) => {
			const oldItems = oldModel[category] || {};
			const newItems = newModel[category] || {};

			for (const name in newItems) {
				if (!oldItems[name]) {
					added.push({ category, data: newItems[name] });
				}
			}

			for (const name in oldItems) {
				if (!newItems[name]) {
					removed.push({ category, data: oldItems[name] });
				}
			}

			for (const name in newItems) {
				if (
					oldItems[name] &&
					JSON.stringify(oldItems[name]) !== JSON.stringify(newItems[name])
				) {
					updated.push({ category, data: newItems[name] });
				}
			}
		};

		[
			"entities",
			"relationships",
			"assentities",
			"specializes",
			"notes",
		].forEach(compareCategory);

		return { added, removed, updated };
	}

	_addElement(item) {
		switch (item.category) {
			case "entities":
				this._addEntity(item.data);
				break;
			case "relationships":
				this._addRelationship(item.data);
				break;
			case "assentities":
				this._addAssEntity(item.data);
				break;
			case "specializes":
				this._addSpecialize(item.data);
				break;
		}
	}

	_removeElement(item) {
		const key =
			item.data.type +
			"_" +
			(item.data.name || item.data.value || item.data.ref);
    const cellId = this.elements.get(key);
    const cell = this.graph.getCell(cellId);

    if (!cell) return;

		const links = this.graph.getConnectedLinks(cell);
		const neighbors = this.graph.getNeighbors(cell);

		links.forEach((link) => {
			link.remove();
		});
		neighbors?.forEach((neighbor) => {
			if (
				neighbor.get("type") === "erd.Attribute" ||
				neighbor.get("type") === "erd.Key"
			) neighbor.remove();
			
			if (neighbor.get("type") === "erd.Relationship") {
				const relLinks = this.graph.getConnectedLinks(neighbor);
				const connectedEntities = relLinks
					.map((l) => [l.getSourceCell(), l.getTargetCell()])
					.flat()
					.filter((c) => c && c.get("type") === "erd.Entity");

				if (connectedEntities.length === 0) {
          const relName = neighbor.attributes.attrs.text.text
          neighbor.remove();
					this.elements.delete("relationship_" + relName);
				}
			}
		});

		cell.remove();
		this.elements.delete(key);
	}

	_updateElement(item, type) {
		this._removeElement(item, type);
		this._addElement(item);
	}

	_addEntity(node) {
		const entity = this.factory.createEntity({});
		this.graph.addCell(entity);
		entity.attr("text/text", node.name);

		if (node.attributes && node.attributes.length > 0) {
			node.attributes.forEach((attr) => {
				this._addAttribute(attr, entity);
			});
		}

		this.elements.set(node.type + "_" + node.name, entity.id);
	}

	_addAttribute(attr, node) {
		let attrShape;
		const card = this._create_cardinality(attr.cardinality);

		if (attr.type === "identifier") {
			attrShape = this.factory.createKey({});
		} else {
			attrShape = this.factory.createAttribute({
				cardinality: card,
			});
		}
		let name = attr.name;

		if (
			attr.cardinality &&
			(attr.cardinality.min !== "1" || attr.cardinality.max !== "1")
		)
			name += ` ${card}`;
		attrShape.attr("text/text", name);

		this.graph.addCell(attrShape);
		this.linker.createLink(node, attrShape, this.graph);

		if (attr.type === "composed") {
			attrShape.set("composed", true);

			attr.attributes.forEach((attrc) => {
				this._addAttribute(attrc, attrShape);
			});
		}
	}

	_addRelationship(node) {
		let rel;
		if (node.refs.length == 1) {
			const idRef = this.elements.get(
				node.refs[0].type + "_" + node.refs[0].name,
			);
			const card = this._create_cardinality(node.refs[0].cardinality);

			const ref = this.graph.getCell(idRef);

			rel = this.linker.addAutoRelationship({
				element: { model: ref },
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
      
			node.refs.forEach((refs) => {
				const entityId = this.elements.get("entity_" + refs.name);
				const assentityId = this.elements.get("assentity_" + refs.name);
				const entity = this.graph.getCell(entityId);
				const assentity = this.graph.getCell(assentityId);

				const card = this._create_cardinality(refs.cardinality);

				if (entity || assentity) {
					const link = this.linker.createLink(
						entity ?? assentity,
						rel,
						this.graph,
					);

					if (refs.weak) {
						link.attributes.weak = refs.weak;
						link.attributes.attrs = {
							".connection": { stroke: "black", "stroke-width": 3 },
						};
					}
					if (refs.role) {
						link.attributes.role = refs.role;
						link.label(1, {
							position: 0.7,
							attrs: { text: { text: refs.role } },
						});
					}
					link.label(0, { position: 0.3, attrs: { text: { text: card } } });
				}
			});
		}

		if (node.attributes && node.attributes.length > 0) {
			node.attributes.forEach((attr) => {
				this._addAttribute(attr, rel);
			});
		}

		this.elements.set(node.type + "_" + node.name, rel.id);
	}

	_addAssEntity(node) {
		const relId = this.elements.get("relationship_" + node.relationship);
		const rel = this.graph.getCell(relId);

		if (rel) {
			const block = this.factory.createBlockAssociative({});
			this.graph.addCell(block);

			block.embed(rel);
			block.set("type", "erd.Associative");

			rel.toFront();
			this.elements.set(node.type + "_" + node.relationship, block.id);
		}
	}

	_addSpecialize(node) {
		const isa = this.factory.createIsa({});
		isa.attributes.attrs.text.text = this._create_notation(node.notation);

		this.graph.addCell(isa);
		this.elements.set(node.type + "_" + node.ref, isa.id);

		const referenceId = this.elements.get("entity_" + node.ref);
		const reference = this.graph.getCell(referenceId);
		if (referenceId) {
			this.linker.createLink(isa, reference, this.graph);

			reference.attributes.isExtended = true;
			isa.attributes.parentId = reference.attributes.id;
		}

		for (const spec of node.specs) {
			const childId = this.elements.get("entity_" + spec.name);
			const child = this.graph.getCell(childId);
			if (child) {
				this.linker.createLink(isa, child, this.graph);
			}
		}
	}

	_cleanupOrphans() {
		const cells = this.graph.getCells();

		for (const cell of cells) {
			if (cell.isLink()) continue;

			const connected = this.graph.getConnectedLinks(cell);

			if (this.validator.isAssociative(cell)) continue;
			if (this.validator.isRelationship(cell)) {
				const parent = cell.get("parent");
				if (parent) {
					const parentCell = this.graph.getCell(parent);
					if (parentCell && this.validator.isAssociative(parentCell)) {
						continue;
					}
				}

				if (connected.length > 0) {
					continue;
				}
			}

			if (connected.length === 0) {
				const key = cell.attr("label/text") || cell.id;
				cell.remove();
				this.elements.delete(key);
			}

			if (cell.attributes.composed) {
				const hasParentMain = connected.some((link) => {
					const src = link.getSourceElement();
					const tgt = link.getTargetElement();
					const other = src?.id === cell.id ? tgt : src;

					if (!other) return false;

					const otherType = other.get("type");
					return (
						otherType === "erd.Entity" ||
						otherType === "erd.Relationship" ||
						otherType === "erd.AssociativeEntity"
					);
				});

				if (!hasParentMain) {
					this._removeSubtree(cell);
				}
			}
		}
	}

	_removeSubtree(cell) {
		const connected = this.graph.getConnectedLinks(cell);
		for (const link of connected) {
			link.remove();
		}

		cell.remove();
	}

	_create_cardinality(cardinality) {
		if (cardinality) return `(${cardinality.min}, ${cardinality.max})`;
		return "(1, 1)";
	}

	_create_notation(notation) {
		if (notation) return `(${notation.type}, ${notation.disjunction})`;
		return "(t, d)";
	}

	applyLayout() {
		const cells = this.graph.getCells();
		const nodes = cells.filter(
			(c) => c.isElement() && !c.get("parent") && c != null,
		);
		const links = cells.filter((c) => c.isLink());

		const g = new dagre.graphlib.Graph();
		g.setGraph({ rankdir: "LR" });
		g.setDefaultEdgeLabel(() => ({}));

		nodes.forEach((n) => {
			const size = n.get("size");
			g.setNode(n.id, { width: size.width, height: size.height });
		});

		const virtualBlocks = new Map();
		this.elements.forEach((blockId, key) => {
			const block = this.graph.getCell(blockId);
			console.log(
				"layout block",
				key,
				block,
				blockId,
				this.graph,
				this.elements,
			);
			if (!this.validator.isAssociative(block)) return;

			const blockSize = block.size();
			const virtualId = `block_${key}`;
			g.setNode(virtualId, {
				width: blockSize.width,
				height: blockSize.height,
			});
			virtualBlocks.set(key, virtualId);
			const relId = this.elements.get(
				key.replace("assentity_", "relationship_"),
			);
			const rel = this.graph.getCell(relId);

			if (rel && this.validator.isRelationship(rel)) {
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
			}
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

		this.elements.forEach((blockId, key) => {
			const block = this.graph.getCell(blockId);
			if (!this.validator.isAssociative(block)) return;

			const virtualId = virtualBlocks.get(key);
			const pos = g.node(virtualId);
			if (block && pos) {
				block.position(
					pos.x - block.size().width / 2,
					pos.y - block.size().height / 2,
				);
				const relId = this.elements.get(
					key.replace("assentity_", "relationship_"),
				);
				const rel = this.graph.getCell(relId);

				if (rel && this.validator.isRelationship(rel)) {
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
