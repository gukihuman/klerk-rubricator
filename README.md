## Klerk Rubricator

### Code challege by Klerk.

README на русском: [README_RU.md](README_RU.md)

#### Choosing between a nested v-for and the recursive component RubricLayer.

The first interesting choice I encountered was whether to use a recursive component for representing an individual layer of the rubricator or just to use a nested v-for multiple times. I wanted the frontend to embody a reliable architecture capable of stably handling data from an API, even if additional nested levels of rubrics appear in the future. Using a nested v-for would have required establishing certain limitations for the backend: the frontend could only process up to, for example, 3 nested levels. Thus, I decided to use a recursive component that represents an individual layer of rubrics and calls itself for child rubrics. I don't see a way to implement recursion without a separate component. However, this introduces a problem in the design of the architecture: an additional component appears in the project, which is not encapsulated, and my colleagues will need to know that this is an internal component not intended for use elsewhere. Despite this, I still consider it a better choice than a nested v-for because it alleviates concerns about increasing numbers of nested levels in the future.
