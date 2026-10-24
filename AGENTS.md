# Coding Rules

* Never assume anything.
* If something is unclear, missing, or not explicitly provided, ask before making a decision.
* Keep code simple and easy to read.
* Do not over-engineer.
* Avoid unnecessary abstractions.
* Avoid complex TypeScript types when a simple type works.
* Avoid unnecessary generics.
* Prefer simple `if` statements.
* Do not create helpers, interfaces, classes, or wrappers unless necessary.
* Do not change the existing architecture unless explicitly requested.
* Do not refactor unrelated code.
* Prefer the simplest working solution.
* Code should be understandable by a junior developer.
* Do not add complexity just for reusability.
* Do not add features, validations, or error handling that were not requested.

## Error Flow Rules

Always respect this flow:

`Datasource -> ApiException -> Repository -> Failure -> UseCase -> UI`

Rules:

* The Datasource may throw `ApiException`.
* The Repository must catch `ApiException` and convert it into `Failure`.
* The UseCase should return `Failure` when validation or business logic fails.
* The UI must only handle `Failure`.
* The UI must not import or handle `ApiException`.
* Do not duplicate error handling across layers.
* Do not add unnecessary `try/catch` in the UI when the Repository already converts errors into `Failure`.
* Keep error handling simple and centralized.
* Do not change this flow unless explicitly requested.

## Important

When modifying existing code:

* Change only what is necessary for the requested task.
* Keep the existing naming and project structure.
* Do not introduce a "better" or more complex architecture unless explicitly requested.
* If the current simple solution works, keep it simple.
* Never assume how an existing part of the project works.
* Never invent routes, API responses, fields, methods, classes, components, paths, dependencies, or business rules.
* If required information is not provided, ask for the relevant code or information before implementing.