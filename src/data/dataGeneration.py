import json
dictionary = json.load(open('dictionary_compact.json'))
sortedWords = []

for word in dictionary:
	if (word[0] != '-'):
		sortedWords.append(word)

sortedWords.sort()
sortedWordsDictionary = { 'text' : sortedWords }

# Json writing example from https://www.geeksforgeeks.org/reading-and-writing-json-to-a-file-in-python/
sortedWordsObject = json.dumps(sortedWordsDictionary)

with open('sortedWords.json', 'w') as file:
	file.write(sortedWordsObject)

# Writing to file example from https://stackabuse.com/reading-and-writing-lists-to-a-file-in-python/
# with open('sortedWords.txt', 'w') as file:
# 	for word in sortedWords:
# 		file.write('%s\n' % word)