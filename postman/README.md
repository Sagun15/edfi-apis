# Postman Collections

This directory contains **Postman collections** for testing the _REST_ APIs.

The collections are organized by API domain and include tests for different endpoints and scenarios.

## Directory Structure

```
postman/
├── README.md
├── collections
│   └── gradebook
│       ├── assessmentLineItems
│       │   ├── delete-assessment-line-items.postman_collection.json
│       │   └── ...
│       ├── assessmentResults
│       │   ├── get-all-assessment-results.postman_collection.json
│       │   └── ...
│       ├── ...
│       └── ...
└── environments
    ├── prod.postman_environment.json
    ├── dev.postman_environment.json
    └── local.postman_environment.json
```

## Environment Setup

- The collections use environment variables for different deployment environments.
- Each environment file present under `/environments` contains the needful variables.

### How to Import Collections?

1. Open Postman
2. Click on "Import" button in the top left corner
3. Choose one of the following import methods:

- Drag and drop the collection files
- Click "Upload Files" and select the collections
- Copy-paste the collection JSON

4. Import the environment files following the same process
5. Select the imported environment from the environment dropdown in the top right
6. Update the environment variables with your specific values:

- baseUrl
- x-client-id
- x-app-key
- bearerToken

## Common Headers

All API requests require the following headers:

```
x-client-id: {{x-client-id}}
x-app-key: {{x-app-key}}
Authorization: {{bearer-token}}
```

## Environment-specific Notes

### Local Environment

- Used for local development and testing
- Requires local server to be running

### Development Environment

- Used for development testing
- Requires dev environment credentials

### Staging Environment

- Used for pre-production testing
- Requires staging environment credentials

### Production Environment

- Used for production verification
- Requires production credentials
- Exercise caution when running destructive tests

## Standard Test Coverage

Each collection should include tests for:

1. **Happy Path Scenarios**

- Basic successful operations
- Operations with optional parameters
- Operations with different field selections

2. **Negative Scenarios**

- Invalid authentication
- Invalid parameters
- Missing required fields
- Not found cases
- Permission issues

### Validation Tests

- All validation tests must be written as Postman scripts using the built-in test framework.
- Scripts should be added in the "Tests" tab of each request.

#### Example validation script:

```
pm.test("Response structure is valid", function () {
    const responseData = pm.response.json();
    pm.expect(responseData).to.have.property('id');
});
```

#### Key areas to validate:

- Response structure and required fields
- Data types and formats
- Field constraints and business rules
- Performance thresholds
- Error responses

For detailed information about writing test scripts, refer to:

- [Postman Test Scripts Documentation](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Postman Test Examples](https://learning.postman.com/docs/writing-scripts/script-references/test-examples/)

## Collection Structure Guide

Each collection should follow this standard structure. Here's a skeleton example with explanations:

```
{
    "info": {
        "_postman_id": "{{guid}}",
        "name": "endpoint-name",
        "description": "Clear description of the API endpoint and test coverage",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Happy Path Tests",
            "item": [
                {
                    "name": "Descriptive test name",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "// Test scripts go here"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "HTTP_METHOD",
                        "header": [
                            {
                                "key": "Authorization",
                                "value": "{{bearer-token}}"
                            }
                        ],
                        "url": {
                            "raw": "{{baseUrl}}/endpoint/{{parameter}}",
                            "host": ["{{baseUrl}}"],
                            "path": ["endpoint", "{{parameter}}"]
                        }
                    }
                }
            ]
        },
        {
            "name": "Negative Tests",
            "item": [
                // Similar structure for negative test cases
            ]
        }
    ],
    "variable": [
        {
            "key": "variableName",
            "value": "defaultValue",
            "type": "string"
        }
    ]
}
```

### Key Components Explained

#### Info Section

- `name`: Endpoint/feature name (e.g., "get-assessment-results")
- `description`: Detailed description of what the collection tests
- `schema`: Always use the latest Postman collection schema

#### Item Groups

- Organize tests into logical groups (e.g., "Happy Path Tests", "Negative Tests")
- Each group contains related test cases

#### Test Cases

- `name`: Clear, descriptive test name
- `event`: Contains test scripts
- `request`: API request details

##### Include assertions for:

- Status codes
- Response structure
- Data validation
- Performance metrics

#### Variables

- Define collection-level variables
- Use meaningful names and default values
