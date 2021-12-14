onmessage = function(e) {
	// data via e.data
	const {sortedWords, board, size, TimesUsed, Frequencies, frequenciesDenom, Dictionary} = e.data;

	// Do DFS, fill the board
  	let wordCounter = 0;
  	let row = 0;
  	let col = 0;
  	let rowOrCol = 0;
  	let foundWord = false;
	let wordsChecked = 0; //counts words of the right length considered for insertion, whether or not they fit
	let wordsInserted = 0; //counts only words actually inserted
  	// let counter = 0;
  	// while (counter < 2000 && (row < size || col < size)) {
  	while (row < size || col < size) {
  		// Go back and replace the most-recently placed word
  		if (rowOrCol > 0) {
			rowOrCol--; // Get back

			if (rowOrCol % 2 === 0) { // Clear row
				// get # rows to clear
				const amountToClear = Math.floor(Math.random() * row) + 1;

				let wordsErased = [];

				// clear rows w/ bound from columns
				for (let i = 0; i < amountToClear; i++) {
					let wordToErase = "";
					for (let j = 0; j < size; j++) {
						wordToErase += board[row-(i+1)][j];
					}
					wordsErased.push(wordToErase);

					for (let j = col; j < size; j++) {
						board[row-(i+1)][j] = "";
					}
				}

				// reduce rows by proper amount
				row -= amountToClear;

				// get words erased, reduce times used by 1
				wordsErased.forEach(word => {
					TimesUsed[word]--;
				});
			} else { // Clear col
				// get # cols to clear
				const amountToClear = Math.floor(Math.random() * col) + 1;

				let wordsErased = [];

				// clear cols w/ bound from rows
				for (let j = 0; j < amountToClear; j++) {
					let wordToErase = "";
					for (let i = 0; i < size; i++) {
						wordToErase += board[i][col-(j+1)];
					}
					wordsErased.push(wordToErase);

					for (let i = row; i < size; i++) {
						board[i][col-(j+1)] = "";
					}
				}

				// reduce cols by proper amount
				col -= amountToClear;

				// get words erased, reduce times used by 1
				wordsErased.forEach(word => {
					TimesUsed[word]--;
				});
			}
		}

		while (wordCounter < sortedWords.length && (row < size || col < size)) {
			// Occasionally jump to a random point in the dictionary
			if (Math.random() < 0.35) {
				// Random int example from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
				wordCounter = Math.floor(Math.random() * sortedWords.length)
			}
			const word = sortedWords[wordCounter];

			if (word.length === size && TimesUsed[word] === 0) { // Fits in board (in simplified nxn case)
				wordsChecked++;
				
				// Go through probabilistic acceptance
				let frequenciesProduct = 1;
				word.split("").forEach(letter => {
					const freq = Frequencies[letter] === undefined ? 0 : Frequencies[letter]/frequenciesDenom;
					frequenciesProduct *= freq;
				});

				// The higher the frequency, the lower the chance of rejecting and the higher the chance of accepting
				if (Math.random() < frequenciesProduct*100) { // Accept
					// Check that the word works with the rest of the board
	  				let fits = true;
	  				for (let i = 0; i < word.length; i++) {
	  					let boardLetter;
	  					if (rowOrCol % 2 === 0) { // Trying a row
	  						boardLetter = board[row][i];
	  					} else { // Trying a col
	  						boardLetter = board[i][col];
	  					}

	  					if (boardLetter != "" && boardLetter != word[i]) fits = false;
	  				}

	  				if (fits) { // If the word was placed/is able to be placed
	  					for (let i = 0; i < word.length; i++) {
		  					if (rowOrCol % 2 === 0) { // Trying a row
		  						board[row][i] = word[i];
		  					} else { // Trying a col
		  						board[i][col] = word[i];
		  					}
		  				}
		  				foundWord = true;
		  				TimesUsed[word]++;
							wordsInserted++;
	  				}
				}
			}

			if (foundWord) {
	  			if (rowOrCol % 2 === 0) { // Filled in a row
	  				if (col < size) { // We haven't filled all columns, so switch rowOrCol
	  					rowOrCol++;
	  				}
	  				row++;
	  			} else { // Filled in a col
	  				if (row < size) { // We haven't filled all rows, so switch rowOrCol
	  					rowOrCol++;
	  				}
	  				col++;
	  			}
	  			foundWord = false;
	  		}

			wordCounter++;
		}
		wordCounter = 0;
		// counter++;
	}

	// Get clues, aka definitions
	let clues = [];
	let rowDefinitions = [];
	let colDefinitions = [];

	// Get words
	for (let i = 0; i < size; i++) {
		let rowWord = "";
		let colWord = "";

		for (let j = 0; j < size; j++) {
			rowWord += board[i][j];
			colWord += board[j][i];
		}
		const rowDefinition = Dictionary[rowWord];
		rowDefinitions.push(rowDefinition);
		const colDefinition = Dictionary[colWord];
		colDefinitions.push(colDefinition);
	}
	clues = clues.concat(colDefinitions);
	clues = clues.concat(rowDefinitions);

	postMessage({ 
		data: board, 
		clues: clues, 
		inserted: wordsInserted,
		tested: wordsChecked,
	});
}