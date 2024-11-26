const { exec } = require('child_process');
const { argv } = require('node:process');
const fs = require('fs');

const SWAGGER_CODEGEN_JAR_LOCATION =
  './tools/lib/swagger-codegen-cli-3.0.57.jar';
const SDK_LOCATION = './src/app/shared/sdk/rest-api';
const FILES_TO_REMOVE = [
  'ng-package.json',
  'index.ts',
  'git_push.sh',
  '.npmignore',
  '.gitignore',
  '.swagger-codegen',
];

function verifyJavaInstalled(callback) {
  exec('java -version', [], (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      callback(false);
      return;
    }

    // Information can come from either stderr or stdout
    const dataStrStdOut = stdout?.toString()?.toLowerCase();
    const dataStrStdErr = stderr?.toString()?.toLowerCase();
    const strToCheck = 'runtime environment';

    callback(
      dataStrStdOut?.includes(strToCheck) || dataStrStdErr?.includes(strToCheck)
    );
  });
}

function executeGenerator(callback) {
  const apiLocation = argv[2];

  // clear directory before running generator
  fs.rmSync(SDK_LOCATION, { recursive: true });

  exec(
    `java -jar ${SWAGGER_CODEGEN_JAR_LOCATION} \
        generate -i ${apiLocation} \
        -l typescript-angular \
        -o ${SDK_LOCATION} \
        --additional-properties=useOverride=true \
        --type-mappings Date=string
        `,

    (err, stdout, stderr) => {
      console.error(stdout);
      console.error(stderr);
      if (err) {
        console.error(err);
        console.error('Failed to run code generator');
        return;
      }
      console.log('Generated Code');
      callback();
    }
  );
}

function removeUnusedFiles() {
  FILES_TO_REMOVE.forEach(file => {
    console.log(`Removing unused file ${file}`);
    fs.rmSync(`${SDK_LOCATION}/${file}`, {
      recursive: true,
    });
  });
}

function main() {
  if (argv.length < 3) {
    console.log('Usage: npm run generate-api -- <path to api json>');
    return;
  }

  const apiLocation = argv[2];

  console.log(`Generating api from '${apiLocation}'`);

  verifyJavaInstalled(hasJava => {
    if (!hasJava) {
      console.error(
        'Java is not installed! Java is required to run code generator'
      );
      return;
    }
    executeGenerator(() => {
      removeUnusedFiles();
      console.log('Done');
    });
  });
}

main();
