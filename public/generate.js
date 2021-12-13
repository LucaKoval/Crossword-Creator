onmessage = function(e) {
	// data via e.data
	const {sortedWords, board, size, TimesUsed, Frequencies, frequenciesDenom, Dictionary} = e.data;

	// Do DFS, fill the board
  	let wordCounter = 0;
  	let row = 0;
  	let col = 0;
  	let rowOrCol = 0;
  	let foundWord = false;
  	let blockedSquare = -1;
  	let foundFirstWord = false;
  	let foundSecondWord = false;
  	// let counter = 0;
  	// while (counter < 2000 && (row < size || col < size)) {
  	while (row < size || col < size) {
  		// Go back and replace the most-recently placed word
  		if (rowOrCol > 0) {
  			console.log(board)
			rowOrCol--; // Get back

			if (rowOrCol % 2 === 0) { // Clear row
				// get # rows to clear
				const amountToClear = row === 0 ? 0 : Math.floor(Math.random() * row) + 1;

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
				if (row > 0) row -= amountToClear;

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
				if (col > 0) col -= amountToClear;

				// get words erased, reduce times used by 1
				wordsErased.forEach(word => {
					TimesUsed[word]--;
				});
			}
			console.log(row, col)
		}

		// Go through dictionary to try and find a word that fits
		// console.log(wordCounter, row, col, wordCounter < sortedWords.length && (row < size || col < size))
		while (wordCounter < sortedWords.length && (row < size || col < size)) {
			// Randomization of word in dictionary to try
			if (Math.random() < 0.35) {
				// Random int example from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
				wordCounter = Math.floor(Math.random() * sortedWords.length)
			}
			const word = sortedWords[wordCounter];

			// Chance to throw in blocked square
			if (blockedSquare === -1 && Math.random() < 0.25) {
				// console.log('asdf')
				// Find where in the row/col the blocked square will go
				blockedSquare = Math.floor(Math.random() * size); // Generates between 0 and (size - 1), inclusive
			}

			if (blockedSquare === 0) {
				foundFirstWord = true;
			}

			// console.log(blockedSquare)
			// console.log(word)

			if (((blockedSquare === -1 && word.length === size) || (blockedSquare !== -1 && !foundFirstWord && word.length === blockedSquare) || (blockedSquare !== -1 && foundFirstWord && word.length === size - blockedSquare - 1)) && TimesUsed[word] === 0) { // Fits in board (in simplified nxn case)
				// console.log((blockedSquare === -1 && word.length === size), (blockedSquare !== -1 && !foundFirstWord && word.length === blockedSquare), (blockedSquare !== -1 && foundFirstWord && word.length === size - blockedSquare - 1))
				console.log(blockedSquare, foundFirstWord, foundSecondWord, word)
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

	  				// Need to figure out the beginning and end of the word
	  				let beginning;
	  				let end;
	  				if (blockedSquare === -1) { // If there is no blocked square
	  					beginning = 0;
	  					end = size;
	  				} else { // If there is a blocked square
	  					if (!foundFirstWord) { // Trying to find the first word
	  						beginning = 0;
	  						end = blockedSquare;
	  					} else { // Trying to find the second word
	  						beginning = blockedSquare + 1;
	  						end = size;
	  					}
	  				}

	  				let wordIndexShift = (blockedSquare !== -1 && foundFirstWord) ? (blockedSquare + 1) : 0
	  				for (let i = beginning; i < end; i++) {
	  					let boardLetter;
	  					if (rowOrCol % 2 === 0) { // Trying a row
	  						boardLetter = board[row][i];
	  					} else { // Trying a col
	  						boardLetter = board[i][col];
	  					}

	  					if (boardLetter != "" && boardLetter != word[i - wordIndexShift]) fits = false;
	  				}

	  				if (fits) { // If the word was placed/is able to be placed
	  					console.log('fits')
	  					// if (blockedSquare !== -1) {
			  			// 	if (!foundFirstWord) {
			  			// 		console.log("beginning, end: ", beginning, end)
				  		// 	}
				  		// }
	  					for (let i = beginning; i < end; i++) {

	  						if (blockedSquare !== -1) {
			  					if (!foundFirstWord) {
			  						console.log(word[i - wordIndexShift], i - wordIndexShift)
			  						console.log(row, col, i)
				  				}
				  			}



		  					if (rowOrCol % 2 === 0) { // Trying a row
		  						console.log('setting with ' + word[i - wordIndexShift])
		  						board[row][i] = word[i - wordIndexShift];
		  						console.log(board[row][i])
		  						console.log(board, board[0][0], board[0][1], board[1][0], board[1][1])
		  					} else { // Trying a col
		  						console.log('setting with ' + word[i - wordIndexShift])
		  						board[i][col] = word[i - wordIndexShift];
		  						console.log(board[i][col])
		  						console.log(board, board[0][0], board[0][1], board[1][0], board[1][1])
		  					}
		  				}
		  				foundWord = true;
		  				TimesUsed[word]++;

		  				// Logic for finding words in row/col with a blocked square
		  				if (blockedSquare !== -1) {
		  					if (!foundFirstWord) {
		  						console.log('setting foundFirstWord to true')
		  						console.log(board)
			  					foundFirstWord = true;

			  					// The blocked square is on one of the edges of the board
			  					if (blockedSquare === 1 || blockedSquare === size - 1) {
			  						foundSecondWord = true;
			  					}
			  				} else { // We have already found a first word, we must have found the second
			  					console.log('setting foundSecondWord to true')
			  					foundSecondWord = true;
			  				}
			  			}
	  				}
				}
			}

			if (foundWord && (blockedSquare === -1 || (blockedSquare !== -1 && foundSecondWord))) {
				console.log('bruh: ', foundWord, blockedSquare, foundFirstWord, foundSecondWord)
				console.log(row, col)

				if (size === 1) { // Edge case where game board is 1x1
					row = 1;
					col = 1;
				} else {
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
		  		}

		  		console.log(row, col)

	  			foundWord = false;
	  			foundFirstWord = false;
	  			foundSecondWord = false;
	  		}

	  		// If we didn't find any words that worked for the blocked square, reset it
	  		if (blockedSquare !== -1 && !foundFirstWord) {
	  			blockedSquare = -1;
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

	postMessage({ data: board, clues: clues });
}