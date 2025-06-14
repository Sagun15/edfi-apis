#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to extract endpoint specifications from OpenAPI/Swagger JSON files
 * and resolve all $ref references to create a complete endpoint definition.
 * 
 * Usage: node extract-endpoint-spec.js <endpoint-path> [spec-file-path] [output-file-path]
 * Example: node extract-endpoint-spec.js "/ed-fi/students"
 */

class EndpointSpecExtractor {
    constructor(specFilePath = '.cursor/edfi-spec-swagger.json', outputFilePath = 'endpoint-spec.json') {
        this.specFilePath = specFilePath;
        this.outputFilePath = outputFilePath;
        this.spec = null;
        this.resolvedRefs = new Map(); // Cache for resolved references
    }

    /**
     * Load and parse the OpenAPI specification file
     */
    loadSpec() {
        try {
            console.log(`Loading specification from: ${this.specFilePath}`);
            const specContent = fs.readFileSync(this.specFilePath, 'utf8');
            this.spec = JSON.parse(specContent);
            console.log('✅ Specification loaded successfully');
        } catch (error) {
            console.error('❌ Error loading specification file:', error.message);
            process.exit(1);
        }
    }

    /**
     * Resolve a $ref reference to its actual content
     * @param {string} refPath - The reference path (e.g., "#/components/responses/Updated")
     * @returns {any} - The resolved content
     */
    resolveRef(refPath) {
        // Check cache first
        if (this.resolvedRefs.has(refPath)) {
            return this.resolvedRefs.get(refPath);
        }

        if (!refPath.startsWith('#/')) {
            console.warn(`⚠️  Unsupported reference format: ${refPath}`);
            return { $ref: refPath }; // Return as-is if not internal reference
        }

        // Remove the '#/' prefix and split the path
        const pathParts = refPath.substring(2).split('/');
        
        // Navigate through the spec object
        let current = this.spec;
        for (const part of pathParts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                console.warn(`⚠️  Reference not found: ${refPath}`);
                return { $ref: refPath }; // Return original ref if not found
            }
        }

        // Cache the resolved reference
        this.resolvedRefs.set(refPath, current);
        
        // Recursively resolve any nested references
        const resolved = this.resolveNestedRefs(current);
        this.resolvedRefs.set(refPath, resolved);
        
        return resolved;
    }

    /**
     * Recursively resolve all $ref references in an object
     * @param {any} obj - The object to process
     * @returns {any} - The object with all references resolved
     */
    resolveNestedRefs(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.resolveNestedRefs(item));
        }

        // Handle $ref property
        if (obj.$ref && typeof obj.$ref === 'string') {
            console.log(`🔗 Resolving reference: ${obj.$ref}`);
            return this.resolveRef(obj.$ref);
        }

        // Process all properties recursively
        const resolved = {};
        for (const [key, value] of Object.entries(obj)) {
            resolved[key] = this.resolveNestedRefs(value);
        }

        return resolved;
    }

    /**
     * Extract endpoint specification for a given path
     * @param {string} endpointPath - The endpoint path (e.g., "/ed-fi/students")
     * @returns {object|null} - The complete endpoint specification or null if not found
     */
    extractEndpoint(endpointPath) {
        if (!this.spec || !this.spec.paths) {
            console.error('❌ Invalid specification format - missing paths');
            return null;
        }

        // Find the endpoint in the paths
        const endpoint = this.spec.paths[endpointPath];
        if (!endpoint) {
            console.error(`❌ Endpoint not found: ${endpointPath}`);
            console.log('Available endpoints:');
            Object.keys(this.spec.paths).forEach(path => {
                console.log(`  - ${path}`);
            });
            return null;
        }

        console.log(`✅ Found endpoint: ${endpointPath}`);
        
        // Resolve all references in the endpoint
        const resolvedEndpoint = this.resolveNestedRefs(endpoint);
        
        return {
            path: endpointPath,
            specification: resolvedEndpoint,
            extractedAt: new Date().toISOString(),
            sourceFile: this.specFilePath
        };
    }

    /**
     * Save the extracted endpoint specification to a file
     * @param {object} endpointSpec - The complete endpoint specification
     */
    saveEndpointSpec(endpointSpec) {
        try {
            // Ensure output directory exists
            const outputDir = path.dirname(this.outputFilePath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Write the specification to file
            const jsonContent = JSON.stringify(endpointSpec, null, 2);
            fs.writeFileSync(this.outputFilePath, jsonContent, 'utf8');
            
            console.log(`✅ Endpoint specification saved to: ${this.outputFilePath}`);
            console.log(`📊 File size: ${(jsonContent.length / 1024).toFixed(2)} KB`);
            console.log(`🔗 References resolved: ${this.resolvedRefs.size}`);
        } catch (error) {
            console.error('❌ Error saving endpoint specification:', error.message);
            process.exit(1);
        }
    }

    /**
     * Main extraction process
     * @param {string} endpointPath - The endpoint path to extract
     */
    extract(endpointPath) {
        console.log(`🚀 Starting endpoint extraction for: ${endpointPath}`);
        console.log('='.repeat(60));

        // Load the specification
        this.loadSpec();

        // Extract the endpoint
        const endpointSpec = this.extractEndpoint(endpointPath);
        if (!endpointSpec) {
            process.exit(1);
        }

        // Save the result
        this.saveEndpointSpec(endpointSpec);

        console.log('='.repeat(60));
        console.log('🎉 Extraction completed successfully!');
    }
}

// Main execution
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node extract-endpoint-spec.js <endpoint-path> [spec-file-path] [output-file-path]');
        console.log('');
        console.log('Examples:');
        console.log('  node extract-endpoint-spec.js "/ed-fi/students"');
        console.log('  node extract-endpoint-spec.js "/ed-fi/schools" "custom-spec.json" "schools-spec.json"');
        console.log('');
        console.log('Default spec file: .cursor/edfi-spec-swagger.json');
        console.log('Default output file: endpoint-spec.json');
        process.exit(1);
    }

    const endpointPath = args[0];
    const specFilePath = args[1] || '.cursor/edfi-spec-swagger.json';
    const outputFilePath = args[2] || 'endpoint-spec.json';

    const extractor = new EndpointSpecExtractor(specFilePath, outputFilePath);
    extractor.extract(endpointPath);
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = EndpointSpecExtractor; 