const { glob } = require('glob');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PROTO_SOURCE_PATTERN = 'apps/*/src/infrastructure/proto/*.proto';
const PROTO_OUT_DIR = 'libs/protos/src/generated';

function checkProtoc() {
    try {
        execSync('protoc --version', { stdio: 'pipe' });
    } catch (error) {
        console.error('\x1b[31mError: protoc is not installed!\x1b[0m');
        console.log('\nPlease install Protocol Buffers compiler (protoc):');
        console.log('\nOn macOS:');
        console.log('  brew install protobuf');
        console.log('\nOn Linux:');
        console.log('  apt-get install -y protobuf-compiler');
        console.log('\nOn Windows:');
        console.log('  Download from https://github.com/protocolbuffers/protobuf/releases');
        process.exit(1);
    }
}

function createServiceIndex(serviceOutDir) {
    const files = fs.readdirSync(serviceOutDir)
        .filter(file => file.endsWith('.ts') && file !== 'index.ts');
    const content = files.map(file => `export * from './${path.basename(file, '.ts')}';`).join('\n');
    fs.writeFileSync(path.join(serviceOutDir, 'index.ts'), content + '\n');
}

async function generateProtos() {
    checkProtoc();
        
    try {
        // Ensure output directory exists
        fs.mkdirSync(PROTO_OUT_DIR, { recursive: true });
        // Find all proto files in apps
        const protoFiles = await glob(PROTO_SOURCE_PATTERN);

        for (const protoFile of protoFiles) {
            // Extract service name from path (e.g., 'user' from 'apps/users/src/infrastructure/proto/user.proto')
            const serviceName = path.basename(protoFile, '.proto');
            const serviceOutDir = path.join(PROTO_OUT_DIR, serviceName);
            fs.mkdirSync(serviceOutDir, { recursive: true });

            const command = `protoc \
                --plugin=./node_modules/.bin/protoc-gen-ts_proto \
                --ts_proto_out=${serviceOutDir} \
                --ts_proto_opt=nestJs=true \
                --ts_proto_opt=outputServices=grpc-js \
                --ts_proto_opt=esModuleInterop=true \
                --proto_path=${path.dirname(protoFile)} \
                ${protoFile}`;
            console.log(`Generating types for ${serviceName}...`);
            execSync(command, { stdio: 'inherit' });
            createServiceIndex(serviceOutDir);
        }

        generateIndex();

        console.log('Proto generation completed successfully!');
    } catch (error) {
        console.error('Error generating protos:', error);
        process.exit(1);
    }
}

function generateIndex() {
    // Get all directories in the generated folder
    const services = fs.readdirSync(PROTO_OUT_DIR, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const indexContent = services
        .map(service => `export * from './${service}';`)
        .join('\n');

    fs.writeFileSync(
        path.join(PROTO_OUT_DIR, 'index.ts'),
        indexContent + '\n'
    );
}

generateProtos();