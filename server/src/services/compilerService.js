const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, execFile } = require('child_process');

const TIMEOUT_MS = 6000; // 6 seconds timeout limit
const MAX_BUFFER = 1024 * 512; // 512 KB max buffer

/**
 * Executes a child process with stdin and returns stdout/stderr and runtime
 */
const runProcess = (command, args, input = '', timeout = TIMEOUT_MS, cwd = null) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    let isTimedOut = false;

    const child = spawn(command, args, {
      cwd: cwd || os.tmpdir(),
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const timer = setTimeout(() => {
      isTimedOut = true;
      try {
        child.kill('SIGKILL');
      } catch (e) {}
    }, timeout);

    if (input) {
      try {
        child.stdin.write(input);
        child.stdin.end();
      } catch (err) {
        // Stdin write error
      }
    } else {
      try {
        child.stdin.end();
      } catch (e) {}
    }

    child.stdout.on('data', (data) => {
      if (stdout.length < MAX_BUFFER) {
        stdout += data.toString();
      }
    });

    child.stderr.on('data', (data) => {
      if (stderr.length < MAX_BUFFER) {
        stderr += data.toString();
      }
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        success: false,
        stdout,
        stderr: err.message,
        executionTime: Date.now() - startTime,
        exitCode: -1,
        isTimedOut: false,
      });
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      const executionTime = Date.now() - startTime;
      resolve({
        success: code === 0 && !isTimedOut,
        stdout,
        stderr: isTimedOut ? 'Execution Timed Out (Limit: 6s)' : stderr,
        executionTime,
        exitCode: isTimedOut ? -9 : code,
        isTimedOut,
      });
    });
  });
};

/**
 * Main execution handler supporting Python, C, C++, Java, JavaScript
 */
const executeCode = async (language, code, customInput = '') => {
  const normalizedLang = (language || 'javascript').toLowerCase();
  const runId = `dl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const tempDir = path.join(os.tmpdir(), runId);

  try {
    fs.mkdirSync(tempDir, { recursive: true });

    let sourceFile = '';
    let compileResult = null;
    let runResult = null;

    if (normalizedLang === 'python') {
      sourceFile = path.join(tempDir, 'main.py');
      fs.writeFileSync(sourceFile, code, 'utf8');
      runResult = await runProcess('python', [sourceFile], customInput, TIMEOUT_MS, tempDir);
    } else if (normalizedLang === 'javascript') {
      sourceFile = path.join(tempDir, 'main.js');
      fs.writeFileSync(sourceFile, code, 'utf8');
      runResult = await runProcess('node', [sourceFile], customInput, TIMEOUT_MS, tempDir);
    } else if (normalizedLang === 'cpp') {
      sourceFile = path.join(tempDir, 'main.cpp');
      const exeFile = path.join(tempDir, 'main.exe');
      fs.writeFileSync(sourceFile, code, 'utf8');

      // Compile C++
      compileResult = await runProcess('g++', ['-O2', sourceFile, '-o', exeFile], '', 10000, tempDir);
      if (compileResult.exitCode !== 0) {
        return {
          status: 'Compilation Error',
          output: compileResult.stderr || compileResult.stdout,
          executionTime: compileResult.executionTime,
          isError: true,
        };
      }

      runResult = await runProcess(exeFile, [], customInput, TIMEOUT_MS, tempDir);
    } else if (normalizedLang === 'c') {
      sourceFile = path.join(tempDir, 'main.c');
      const exeFile = path.join(tempDir, 'main.exe');
      fs.writeFileSync(sourceFile, code, 'utf8');

      // Compile C
      compileResult = await runProcess('gcc', ['-O2', sourceFile, '-o', exeFile], '', 10000, tempDir);
      if (compileResult.exitCode !== 0) {
        return {
          status: 'Compilation Error',
          output: compileResult.stderr || compileResult.stdout,
          executionTime: compileResult.executionTime,
          isError: true,
        };
      }

      runResult = await runProcess(exeFile, [], customInput, TIMEOUT_MS, tempDir);
    } else if (normalizedLang === 'java') {
      sourceFile = path.join(tempDir, 'Main.java');
      fs.writeFileSync(sourceFile, code, 'utf8');

      // Compile Java
      compileResult = await runProcess('javac', [sourceFile], '', 10000, tempDir);
      if (compileResult.exitCode !== 0) {
        return {
          status: 'Compilation Error',
          output: compileResult.stderr || compileResult.stdout,
          executionTime: compileResult.executionTime,
          isError: true,
        };
      }

      runResult = await runProcess('java', ['-cp', tempDir, 'Main'], customInput, TIMEOUT_MS, tempDir);
    } else {
      return {
        status: 'Error',
        output: `Unsupported language: ${language}`,
        executionTime: 0,
        isError: true,
      };
    }

    if (runResult.isTimedOut) {
      return {
        status: 'Time Limit Exceeded',
        output: 'Time Limit Exceeded (Terminated after 6 seconds).',
        executionTime: runResult.executionTime,
        isError: true,
      };
    }

    if (runResult.exitCode !== 0 && runResult.stderr) {
      return {
        status: 'Runtime Error',
        output: runResult.stderr || runResult.stdout,
        executionTime: runResult.executionTime,
        isError: true,
      };
    }

    return {
      status: 'Success',
      output: runResult.stdout || (runResult.stderr ? runResult.stderr : 'Program completed with no output.'),
      executionTime: runResult.executionTime,
      isError: false,
    };
  } catch (err) {
    return {
      status: 'Server Error',
      output: `Internal execution error: ${err.message}`,
      executionTime: 0,
      isError: true,
    };
  } finally {
    // Cleanup temporary files
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanErr) {
      // Ignore cleanup error
    }
  }
};

/**
 * Runs code against multiple test cases and assesses problem solution
 */
const evaluateTestCases = async (language, code, testCases = []) => {
  const results = [];
  let passedCount = 0;
  let totalRuntime = 0;

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execRes = await executeCode(language, code, tc.input || '');
    totalRuntime += execRes.executionTime;

    const actual = (execRes.output || '').trim();
    const expected = (tc.expectedOutput || '').trim();
    const passed = !execRes.isError && actual === expected;

    if (passed) passedCount++;

    results.push({
      testCaseIndex: i + 1,
      input: tc.isHidden ? '[Hidden Test Case]' : tc.input,
      expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
      actualOutput: tc.isHidden ? (passed ? '[Passed]' : actual) : actual,
      passed,
      status: execRes.status,
      executionTime: execRes.executionTime,
      isHidden: tc.isHidden || false,
    });
  }

  const allPassed = passedCount === testCases.length && testCases.length > 0;
  let overallStatus = allPassed ? 'Accepted' : 'Wrong Answer';
  if (results.some((r) => r.status === 'Compilation Error')) {
    overallStatus = 'Compilation Error';
  } else if (results.some((r) => r.status === 'Time Limit Exceeded')) {
    overallStatus = 'Time Limit Exceeded';
  } else if (results.some((r) => r.status === 'Runtime Error')) {
    overallStatus = 'Runtime Error';
  }

  return {
    overallStatus,
    passedTestCases: passedCount,
    totalTestCases: testCases.length,
    results,
    averageRuntimeMs: testCases.length > 0 ? Math.round(totalRuntime / testCases.length) : 0,
  };
};

module.exports = {
  executeCode,
  evaluateTestCases,
};
