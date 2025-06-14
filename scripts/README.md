# Endpoint Specification Extractor

This script extracts specific endpoint specifications from OpenAPI/Swagger JSON files and resolves all `$ref` references to create a complete, self-contained endpoint definition.

## Features

- ✅ **Complete Reference Resolution**: Automatically resolves all `$ref` references recursively
- ✅ **Nested Reference Support**: Handles deeply nested references in schemas, responses, and parameters
- ✅ **Caching**: Efficiently caches resolved references to avoid duplicate processing
- ✅ **Error Handling**: Provides clear error messages and validation
- ✅ **Metadata**: Includes extraction timestamp and source file information
- ✅ **Flexible Output**: Customizable output file paths

## Usage

### Command Line

```bash
# Basic usage - extracts to endpoint-spec.json
node scripts/extract-endpoint-spec.js "/ed-fi/students"

# Custom output file
node scripts/extract-endpoint-spec.js "/ed-fi/students" ".cursor/edfi-spec-swagger.json" "students-spec.json"

# Using npm script
npm run extract-endpoint "/ed-fi/students"
```

### Parameters

1. **endpoint-path** (required): The API endpoint path to extract (e.g., "/ed-fi/students")
2. **spec-file-path** (optional): Path to the OpenAPI specification file (default: ".cursor/edfi-spec-swagger.json")
3. **output-file-path** (optional): Output file path (default: "endpoint-spec.json")

## Examples

### Extract Students Endpoint
```bash
node scripts/extract-endpoint-spec.js "/ed-fi/students"
```

### Extract Schools Endpoint with Custom Output
```bash
node scripts/extract-endpoint-spec.js "/ed-fi/schools" ".cursor/edfi-spec-swagger.json" "schools-api-spec.json"
```

### Extract Courses Endpoint
```bash
node scripts/extract-endpoint-spec.js "/ed-fi/courses"
```

## Reference Resolution Example

**Before (with $ref):**
```json
{
  "responses": {
    "200": {
      "$ref": "#/components/responses/Updated"
    }
  }
}
```

**After (resolved):**
```json
{
  "responses": {
    "200": {
      "description": "The resource was updated. An updated ETag value is available in the ETag header of the response."
    }
  }
}
```

## Output Format

The generated file contains:

```json
{
  "path": "/ed-fi/students",
  "specification": {
    // Complete endpoint specification with all references resolved
    "get": { ... },
    "post": { ... },
    "put": { ... },
    "delete": { ... }
  },
  "extractedAt": "2025-06-03T11:59:24.526Z",
  "sourceFile": ".cursor/edfi-spec-swagger.json"
}
```

## Supported Reference Types

- ✅ Component schemas (`#/components/schemas/...`)
- ✅ Component responses (`#/components/responses/...`)
- ✅ Component parameters (`#/components/parameters/...`)
- ✅ Component request bodies (`#/components/requestBodies/...`)
- ✅ Component headers (`#/components/headers/...`)
- ✅ Component examples (`#/components/examples/...`)
- ✅ Nested references within resolved objects

## Error Handling

The script provides helpful error messages for common issues:

- **Endpoint not found**: Lists all available endpoints
- **Invalid specification file**: Clear JSON parsing errors
- **Missing references**: Warnings for unresolvable references
- **File system errors**: Detailed file access error messages

## Performance

- **Caching**: Resolved references are cached to avoid duplicate processing
- **Memory efficient**: Processes large specification files without loading everything into memory
- **Fast execution**: Typical extraction takes 1-3 seconds for complex endpoints

## Use Cases

1. **API Development**: Extract specific endpoint specs for individual API implementation
2. **Documentation**: Create focused documentation for specific endpoints
3. **Testing**: Generate test specifications for specific API endpoints
4. **Code Generation**: Use resolved specs for automated code generation
5. **API Analysis**: Analyze complete endpoint definitions without reference chasing

## Troubleshooting

### Common Issues

1. **"Endpoint not found"**: Check the exact endpoint path in the specification file
2. **"Reference not found"**: The specification file may have broken references
3. **"File not found"**: Verify the specification file path is correct
4. **Large output files**: Complex endpoints with many references will generate large files

### Getting Available Endpoints

If you're unsure about available endpoints, run the script with an invalid endpoint to see the list:

```bash
node scripts/extract-endpoint-spec.js "/invalid-endpoint"
```

This will display all available endpoints in the specification file. 