export default class SemanticInterpreter {
	constructor() {
		this.errors = [];
	}

	execute(ast) {
		this.errors = [];
    
		return {
			success: this.errors.length === 0,
			errors: this.errors,
		};
	}
}
