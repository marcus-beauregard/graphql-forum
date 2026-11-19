const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const entry = path.resolve(__dirname, '..', 'index.js');

function startFrom(cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [entry], { cwd });
    let out = '';
    let err = '';
    let ready = false;
    let settled = false;
    const timer = setTimeout(() => {
      child.kill();
      done(reject, new Error(`timed out starting from ${cwd}\nstdout: ${out}\nstderr: ${err}`));
    }, 10000);
    function done(fn, value) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    }
    child.stdout.on('data', (data) => {
      out += data.toString();
      if (!ready && out.includes('graphql-forum ready at')) {
        ready = true;
        child.kill();
      }
    });
    child.stderr.on('data', (data) => { err += data.toString(); });
    child.on('error', (error) => done(reject, error));
    child.on('close', (code) => {
      if (ready) {
        done(resolve, out);
      } else {
        done(reject, new Error(`exited with code ${code} before becoming ready from ${cwd}\nstdout: ${out}\nstderr: ${err}`));
      }
    });
  });
}

test('server starts when cwd is not the repository root', async () => {
  const otherCwd = fs.mkdtempSync(path.join(os.tmpdir(), 'graphql-forum-cwd-'));
  try {
    const out = await startFrom(otherCwd);
    assert.match(out, /graphql-forum ready at/);
  } finally {
    fs.rmSync(otherCwd, { recursive: true, force: true });
  }
});
