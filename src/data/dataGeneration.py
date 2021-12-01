import json
dictionary = json.load(open('dictionary_compact.json'))
sortedWords = []
timesUsed = {}

for word in dictionary:
	if (not "-" in word) and (not " " in word):
		sortedWords.append(word)
		timesUsed[word] = 0

sortedWords.sort()
sortedWordsDictionary = { 'text' : sortedWords }

# Json writing example from https://www.geeksforgeeks.org/reading-and-writing-json-to-a-file-in-python/
sortedWordsObject = json.dumps(sortedWordsDictionary)
timesUsedObject = json.dumps(timesUsed)

with open('sortedWords.json', 'w') as file:
	file.write(sortedWordsObject)
with open('timesUsed.json', 'w') as file:
	file.write(timesUsedObject)