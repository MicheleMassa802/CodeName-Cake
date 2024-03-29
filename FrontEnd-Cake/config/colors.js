export default {

	// general use
	primary_default: '#e0c4f3',
	prim_2: '#ccccff',
	prim_3: '#6699ff',
	prim_4: '#669999',
	prim_5: '#fff2cc',
	secondary: '#f0f0f0',
    darker_secondary:'#b1b1b1',

	// multi-purpose
    white: '#fff',
    black: '#000',

	// colors for the house
	window_outline: '#0086b3',
	window_fill: '#ccf2ff',
	flower_pot: '#862d2d',
	house_outline: '#7e7054',
	house_fill: '#f5f5dc',
	roof_outline: '#732013',
	roof_fill: '#bc4a3c',

	// colors for events
	green: '#a0b6aa',
	yellow: '#eae8ae',
	orange: '#e79c74',
	red: '#c36666',
	blue: '#7986cb',

	getColorByColorwayNumber: function(colorwayNumber) {
		const colorways = [
			this.primary_default,
			this.prim_2,
			this.prim_3,
			this.prim_4,
			this.prim_5,
		];	

		return colorways[colorwayNumber];
	}
}