MAKEFILE_DIR=$(dir $(abspath $(lastword $(MAKEFILE_LIST))))

openapi-ui:
	docker run --rm -p 8090:80 -v $(MAKEFILE_DIR):/local -e SWAGGER_JSON=/local/openapi/openapi.yaml swaggerapi/swagger-ui

openapi-editor:
	docker run --rm -p 8090:80 -v $(MAKEFILE_DIR):/local -e SWAGGER_FILE=/local/openapi/openapi.yaml swaggerapi/swagger-editor

openapi-generate:
	docker run --rm -it -v $(MAKEFILE_DIR):/local openapitools/openapi-generator-cli:v6.5.0 generate -i /local/openapi/openapi.yaml -g typescript-axios -o /local/frontend/src/openapi --openapi-normalizer REFACTOR_ALLOF_WITH_PROPERTIES_ONLY=true

db-apply:
	docker compose run --rm api bundle exec ridgepole --apply --config env:DATABASE_URL -f db/schemas/Schemafile

db-dry-run:
	docker compose run --rm api bundle exec ridgepole --apply --dry-run --config env:DATABASE_URL -f db/schemas/Schemafile
