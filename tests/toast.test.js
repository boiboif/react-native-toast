const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const sourcePath = path.join(__dirname, '../src/index.ts');
const { outputText } = ts.transpileModule(readFileSync(sourcePath, 'utf8'), {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
  fileName: sourcePath,
});

const loadToast = () => {
  const calls = { show: [], defaultStyle: [] };
  const native = {
    showWithOptions: (...args) => calls.show.push(args),
    setDefaultStyle: (...args) => calls.defaultStyle.push(args),
  };
  const module = { exports: {} };

  vm.runInNewContext(
    outputText,
    {
      module,
      exports: module.exports,
      require: (id) => {
        assert.equal(id, './specs/NativeReactNativeToast');
        return native;
      },
    },
    { filename: sourcePath }
  );

  return {
    Toast: module.exports.default,
    Native: module.exports.Native,
    calls,
  };
};

test('partial preset styles preserve the built-in colors', () => {
  const { Toast, calls } = loadToast();
  const presets = {
    success: '#52C41A',
    error: '#FF4D4F',
    warning: '#FAAD14',
    info: '#1890FF',
  };

  for (const [preset, backgroundColor] of Object.entries(presets)) {
    Toast.config({ presetStyles: { [preset]: { textColor: '#000000' } } });
    Toast[preset]('Saved');

    assert.deepEqual(calls.show.at(-1), [
      'Saved',
      'short',
      'bottom',
      0,
      0,
      backgroundColor,
      '#000000',
      -1,
      -1,
      16,
      10,
      -1,
    ]);
  }

  assert.deepEqual(calls.defaultStyle, []);
});

test('successive default style updates preserve fields and sync the native style', () => {
  const { Toast, calls } = loadToast();

  Toast.config({
    defaultOptions: {
      duration: 'long',
      style: { backgroundColor: '#112233', textSize: 18 },
    },
  });
  Toast.config({
    defaultOptions: {
      position: 'top',
      style: { textColor: '#FFFFFF', paddingVertical: 0 },
    },
  });
  Toast.show('Updated');

  assert.deepEqual(calls.defaultStyle, [
    [false, '#112233', '', 18, -1, 16, 10, -1],
    [false, '#112233', '#FFFFFF', 18, -1, 16, 0, -1],
  ]);
  assert.deepEqual(calls.show[0], [
    'Updated',
    'long',
    'top',
    0,
    0,
    '#112233',
    '#FFFFFF',
    18,
    -1,
    16,
    0,
    -1,
  ]);
});

test('successive preset style updates preserve fields and leave other presets intact', () => {
  const { Toast, calls } = loadToast();

  Toast.config({
    presetStyles: {
      success: { backgroundColor: '#123456', textSize: 20 },
    },
  });
  Toast.config({ presetStyles: { success: { textColor: '#FFFFFF' } } });
  Toast.config({ presetStyles: { success: {} } });
  Toast.success('Success');
  Toast.error('Error');

  assert.deepEqual(calls.show[0].slice(5, 8), ['#123456', '#FFFFFF', 20]);
  assert.equal(calls.show[1][5], '#FF4D4F');
});

test('styles resolve in per-call, preset, then default order', () => {
  const { Toast, calls } = loadToast();

  Toast.config({
    defaultOptions: {
      style: {
        backgroundColor: '#111111',
        textColor: '#222222',
        textSize: 14,
        borderRadius: 6,
      },
    },
    presetStyles: {
      success: { backgroundColor: '#333333', textColor: '#444444' },
    },
  });
  Toast.success('Styled', {
    style: { backgroundColor: '#555555', textSize: 22 },
  });

  assert.deepEqual(calls.show[0].slice(5), [
    '#555555',
    '#444444',
    22,
    6,
    16,
    10,
    -1,
  ]);
});

test('an explicit undefined default style resets the JS and native defaults', () => {
  const { Toast, calls } = loadToast();

  Toast.config({
    defaultOptions: { duration: 'long', style: { backgroundColor: '#123456' } },
  });
  Toast.config({ defaultOptions: { style: undefined } });
  Toast.show('Reset');
  Toast.config({ defaultOptions: { style: { textColor: '#FFFFFF' } } });
  Toast.show('New style');

  assert.deepEqual(calls.defaultStyle[1], [true, '', '', -1, -1, -1, -1, -1]);
  assert.deepEqual(calls.show[0], [
    'Reset',
    'long',
    'bottom',
    0,
    0,
    '',
    '',
    -1,
    -1,
    -1,
    -1,
    -1,
  ]);
  assert.deepEqual(calls.show[1].slice(5), ['', '#FFFFFF', -1, -1, -1, -1, -1]);
});

test('an explicit undefined preset clears its style and falls back to defaults', () => {
  const { Toast, calls } = loadToast();

  Toast.config({ defaultOptions: { style: { backgroundColor: '#123456' } } });
  Toast.config({ presetStyles: { success: undefined } });
  Toast.success('Reset');
  Toast.config({ presetStyles: { success: { textColor: '#FFFFFF' } } });
  Toast.success('New style');

  assert.deepEqual(calls.show[0].slice(5, 7), ['#123456', '']);
  assert.deepEqual(calls.show[1].slice(5, 7), ['#123456', '#FFFFFF']);
});

test('omitting the default style does not reset or resync native styling', () => {
  const { Toast, calls } = loadToast();

  Toast.config({ defaultOptions: { style: { backgroundColor: '#123456' } } });
  Toast.config({ defaultOptions: { duration: 'long' } });
  Toast.show('Retained');

  assert.equal(calls.defaultStyle.length, 1);
  assert.equal(calls.show[0][1], 'long');
  assert.equal(calls.show[0][5], '#123456');
});

test('the advanced native style API keeps replacement and reset semantics', () => {
  const { Native, calls } = loadToast();

  Native.setDefaultStyle({ backgroundColor: '#123456' });
  Native.setDefaultStyle({ textColor: '#FFFFFF' });
  Native.setDefaultStyle(null);

  assert.deepEqual(calls.defaultStyle, [
    [false, '#123456', '', -1, -1, -1, -1, -1],
    [false, '', '#FFFFFF', -1, -1, -1, -1, -1],
    [true, '', '', -1, -1, -1, -1, -1],
  ]);
});

test('numeric colors preserve transparent zero and signed ARGB values', () => {
  const { Toast, calls } = loadToast();

  Toast.show('Colors', {
    style: { backgroundColor: 0, textColor: -1 },
  });

  assert.deepEqual(calls.show[0].slice(5, 7), ['#00000000', '#ffffffff']);
});
