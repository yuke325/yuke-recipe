MAKEFILE_DIR=$(dir $(abspath $(lastword $(MAKEFILE_LIST))))

openapi-ui:
	docker run --rm -p 8090:80 -v $(MAKEFILE_DIR):/local -e SWAGGER_JSON=/local/openapi/hello.yaml swaggerapi/swagger-ui

openapi-editor:
	docker run --rm -p 8090:80 -v $(MAKEFILE_DIR):/local -e SWAGGER_FILE=/local/openapi/hello.yaml swaggerapi/swagger-editor

openapi-generate:
	docker run --rm -it -v $(MAKEFILE_DIR):/local openapitools/openapi-generator-cli:v6.5.0 generate -i /local/openapi/hello.yaml -g typescript-axios -o /local/frontend/src/openapi --openapi-normalizer REFACTOR_ALLOF_WITH_PROPERTIES_ONLY=true
