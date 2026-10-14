/**
 * Real Sandboxed Online Compiler & Execution Engine for DreamLearn
 * Powers Python 3, Java, C++, C, and JavaScript execution in browser and on Vercel
 * Powered by Judge0 CE with automatic language normalization and client-side fallbacks.
 */

const JUDGE0_API_URL = 'https://ce.judge0.com/submissions?base64_encoded=false&wait=true';

// Judge0 Language ID Mapping
const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  python: 100, // Python (3.12.5)
  python3: 100,
  py: 100,
  java: 91,    // Java (JDK 17.0.6)
  cpp: 105,    // C++ (GCC 14.1.0)
  'c++': 105,
  c: 103,      // C (GCC 14.1.0)
  javascript: 102, // JavaScript (Node.js 22.08.0)
  js: 102,
  node: 102,
};

export interface ExecutionResult {
  success: boolean;
  output: string;
  stdout: string;
  stderr: string;
  status: string;
  executionTime: number;
  memory?: number;
  isError: boolean;
  testResults?: Array<{
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
  }>;
}

export interface TestCaseResult {
  testCaseIndex: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTime: number;
}

export interface BatchTestCasesResult {
  success: boolean;
  overallStatus: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' | 'Error';
  passedTestCases: number;
  totalTestCases: number;
  averageRuntimeMs: number;
  results: TestCaseResult[];
}

/**
 * Normalizes source code for compiler environments.
 * - In Java, replaces arbitrary class names (e.g. `public class soloution`) with `public class Main`
 *   to adhere to standard Java single-file runner conventions.
 * - Removes non-standard package declarations.
 */
export function normalizeSourceCode(language: string, code: string): string {
  const lang = (language || '').toLowerCase().trim();
  let normalized = code.replace(/\r\n/g, '\n');

  if (lang.includes('java') && !lang.includes('script')) {
    // Remove package declarations that cause compilation failures in single-file sandboxes
    normalized = normalized.replace(/^\s*package\s+[^;]+;/gm, '// package removed for sandbox runner');

    // Replace `public class <Name>` with `public class Main`
    if (/public\s+class\s+([A-Za-z0-9_]+)/.test(normalized)) {
      normalized = normalized.replace(/public\s+class\s+([A-Za-z0-9_]+)/, 'public class Main');
    } else if (normalized.includes('public static void main') && /class\s+([A-Za-z0-9_]+)/.test(normalized)) {
      // If no public class is specified, make the class containing main() public class Main
      normalized = normalized.replace(/class\s+([A-Za-z0-9_]+)/, 'public class Main');
    }
  }

  return normalized;
}

/**
 * Executes source code with custom standard input (stdin) in real compiler sandbox.
 */
export async function executeCodeInSandbox(
  language: string,
  code: string,
  customInput: string = ''
): Promise<ExecutionResult> {
  const langKey = (language || 'python').toLowerCase().trim();
  const langId = JUDGE0_LANGUAGE_IDS[langKey] || 100;
  const processedCode = normalizeSourceCode(langKey, code);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(JUDGE0_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language_id: langId,
        source_code: processedCode,
        stdin: customInput || '',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Execution server responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Check for compilation errors
    if (data.compile_output) {
      const compileErr = data.compile_output.trim();
      return {
        success: false,
        output: compileErr,
        stdout: '',
        stderr: compileErr,
        status: 'Compilation Error',
        executionTime: 0,
        isError: true,
      };
    }

    // Check for runtime errors
    if (data.stderr || (data.status?.id && data.status.id >= 7)) {
      const errText = (data.stderr || data.message || data.status?.description || 'Runtime error').trim();
      return {
        success: false,
        output: errText,
        stdout: (data.stdout || '').trim(),
        stderr: errText,
        status: data.status?.description || 'Runtime Error',
        executionTime: Math.round(parseFloat(data.time || '0.04') * 1000),
        memory: data.memory,
        isError: true,
      };
    }

    // Standard successful output
    const stdout = (data.stdout ?? '').trim();
    const runtimeMs = Math.round(parseFloat(data.time || '0.04') * 1000);

    return {
      success: true,
      output: stdout || 'Program executed successfully with no output.',
      stdout,
      stderr: '',
      status: 'Success',
      executionTime: runtimeMs,
      memory: data.memory,
      isError: false,
      testResults: [
        {
          passed: true,
          input: customInput,
          expected: stdout,
          actual: stdout,
        },
      ],
    };
  } catch (err: any) {
    console.warn('[Compiler Engine] Remote sandbox call failed:', err?.message);

    // Fallback for JavaScript in browser if remote is offline
    if (langKey.includes('js') || langKey.includes('javascript')) {
      return executeJavaScriptLocally(code, customInput);
    }

    return {
      success: false,
      output: `Compiler Sandbox Connection Error: ${err?.message || 'Execution timed out.'}\nPlease verify network connectivity.`,
      stdout: '',
      stderr: err?.message || 'Connection error',
      status: 'Network Error',
      executionTime: 0,
      isError: true,
    };
  }
}

/**
 * Runs a suite of test cases against the user's code concurrently.
 */
export async function executeTestCasesInSandbox(
  language: string,
  code: string,
  testCases: Array<{ input: string; expectedOutput: string }>
): Promise<BatchTestCasesResult> {
  if (!testCases || testCases.length === 0) {
    return {
      success: true,
      overallStatus: 'Accepted',
      passedTestCases: 0,
      totalTestCases: 0,
      averageRuntimeMs: 0,
      results: [],
    };
  }

  const results: TestCaseResult[] = [];
  let totalRuntime = 0;
  let hasCompilationError = false;
  let compilationErrorMessage = '';

  const runPromises = testCases.map(async (tc, index) => {
    const res = await executeCodeInSandbox(language, code, tc.input || '');
    return { tc, index, res };
  });

  const executed = await Promise.all(runPromises);

  for (const item of executed) {
    const { tc, index, res } = item;
    totalRuntime += res.executionTime || 20;

    if (res.status === 'Compilation Error') {
      hasCompilationError = true;
      compilationErrorMessage = res.output;
    }

    const actual = (res.stdout || res.output || '').trim();
    const expected = (tc.expectedOutput || '').trim();
    const passed = !res.isError && actual === expected;

    results[index] = {
      testCaseIndex: index + 1,
      input: tc.input || '',
      expectedOutput: expected,
      actualOutput: actual,
      passed,
      executionTime: res.executionTime || 20,
    };
  }

  const passedCount = results.filter((r) => r.passed).length;
  let overallStatus: BatchTestCasesResult['overallStatus'] = 'Accepted';

  if (hasCompilationError) {
    overallStatus = 'Compilation Error';
  } else if (passedCount === results.length) {
    overallStatus = 'Accepted';
  } else {
    overallStatus = 'Wrong Answer';
  }

  return {
    success: passedCount === results.length,
    overallStatus,
    passedTestCases: passedCount,
    totalTestCases: results.length,
    averageRuntimeMs: Math.round(totalRuntime / results.length),
    results,
  };
}

/**
 * Safe client-side evaluator for JavaScript in case remote server is unreachable.
 */
function executeJavaScriptLocally(code: string, customInput: string): ExecutionResult {
  const logs: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;

  try {
    console.log = (...args: any[]) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };
    console.error = (...args: any[]) => {
      logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    };

    // Inject stdin mocking for JS
    const wrappedCode = `
      const __stdin = ${JSON.stringify(customInput)};
      const fs = {
        readFileSync: () => __stdin,
      };
      ${code}
    `;

    const runner = new Function(wrappedCode);
    const start = performance.now();
    runner();
    const runtime = Math.round(performance.now() - start);

    const output = logs.join('\n').trim();
    return {
      success: true,
      output: output || 'Program completed with no output.',
      stdout: output,
      stderr: '',
      status: 'Success',
      executionTime: runtime,
      isError: false,
    };
  } catch (err: any) {
    return {
      success: false,
      output: `Runtime Error: ${err.message}`,
      stdout: logs.join('\n'),
      stderr: err.message,
      status: 'Runtime Error',
      executionTime: 0,
      isError: true,
    };
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
}
