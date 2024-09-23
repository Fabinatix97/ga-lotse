
# How to get latest matrix api-docs

It has to be generated from source: https://github.com/matrix-org/matrix-spec?tab=readme-ov-file#building-the-specification

```bash
git clone https://github.com/matrix-org/matrix-spec.git
pip install -r ./matrix-spec/scripts/requirements.txt
python ./matrix-spec/scripts/dump-openapi.py # this will generate: ./scripts/openapi/api-docs.json
```

Copy `./scripts/openapi/api-docs.json` to [matrix-api-v1.9-openapi-v3.1.0.json](resources%2Fapi-docs%2Fmatrix-api%2Fmatrix-api-v1.9-openapi-v3.1.0.json)

WARNING: current `org.openapi.generator` version `7.3.0` does not support OpenApi `v3.1.0` and fails to properly generate some endpoints.  
Curated version without those failing endpoints was manually created here [matrix-api-v1.9-openapi-v3.1.0-curated.json](resources%2Fapi-docs%2Fmatrix-api%2Fmatrix-api-v1.9-openapi-v3.1.0-curated.json)

# To generate api classes run

```bash
./gradlew chat-management:openApiGenerate
```
