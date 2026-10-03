/**
 * ============================================================================
 * js/strings.js - String Visualizations
 * 1. String Traversal
 * 2. Reverse String (Two Pointers)
 * 3. Palindrome String
 * ============================================================================
 */

let currentString = 'racecar';

document.addEventListener('DOMContentLoaded', () => {
  resetVisualization();

  document.getElementById('btnStart').addEventListener('click', startVisualization);
  document.getElementById('btnReset').addEventListener('click', resetVisualization);
  document.getElementById('btnLoad').addEventListener('click', () => {
    currentString = parseStringInput('stringInput', 'racecar');
    resetVisualization();
  });

  document.getElementById('problemSelect').addEventListener('change', () => {
    const prob = document.getElementById('problemSelect').value;
    const inputEl = document.getElementById('stringInput');

    if (prob === 'reverse') {
      inputEl.value = 'algorithm';
      currentString = 'algorithm';
    } else if (prob === 'palindrome') {
      inputEl.value = 'racecar';
      currentString = 'racecar';
    } else {
      inputEl.value = 'hello';
      currentString = 'hello';
    }
    resetVisualization();
  });
});

function resetVisualization() {
  controller.reset();
  currentString = parseStringInput('stringInput', 'racecar');
  const chars = currentString.split('');
  renderArray('canvasArea', chars);
  setStep('Click <strong>Start</strong> to begin stepping through the algorithm.');
  clearResult();
  setComplexity('O(N)', 'O(1)');
}

async function startVisualization() {
  controller.start();
  clearResult();
  const prob = document.getElementById('problemSelect').value;
  const chars = currentString.split('');

  try {
    if (prob === 'traversal') {
      await runTraversal(chars);
    } else if (prob === 'reverse') {
      await runReverse(chars);
    } else if (prob === 'palindrome') {
      await runPalindrome(chars);
    }
  } catch (e) {
    if (e.message !== 'STOPPED') console.error(e);
  } finally {
    controller.finish();
  }
}

// --------------------------------------------------------------------------
// 1. String Traversal
// --------------------------------------------------------------------------
async function runTraversal(chars) {
  setComplexity('O(N)', 'O(1)');
  const n = chars.length;
  const visited = {};

  for (let i = 0; i < n; i++) {
    renderArray('canvasArea', chars, { [i]: `index ${i}` }, { ...visited, [i]: 'active' });
    await controller.step(`Visiting character at <strong>index ${i}</strong>: <code>'${chars[i]}'</code>.`);

    visited[i] = 'match';
    renderArray('canvasArea', chars, { [i]: 'visited' }, { ...visited });
    await controller.sleep(150);
  }

  renderArray('canvasArea', chars, {}, visited);
  setStep(`<strong>String Traversal Complete!</strong> Checked all ${n} characters.`);
  setResult(`Traversed string: "${chars.join('')}"`, true);
}

// --------------------------------------------------------------------------
// 2. Reverse String (In-Place Swap)
// --------------------------------------------------------------------------
async function runReverse(chars) {
  setComplexity('O(N)', 'O(1)');
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    renderArray('canvasArea', chars, { [left]: 'left', [right]: 'right' }, { [left]: 'compare', [right]: 'compare' });
    await controller.step(`Pointers at <code>left = ${left} ('${chars[left]}')</code> and <code>right = ${right} ('${chars[right]}')</code>. Preparing swap.`);

    // Swap
    const temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;

    renderArray('canvasArea', chars, { [left]: 'swapped', [right]: 'swapped' }, { [left]: 'match', [right]: 'match' });
    await controller.step(`Swapped <code>'${temp}'</code> with <code>'${chars[left]}'</code>.`);

    left++;
    right--;
  }

  renderArray('canvasArea', chars, {}, chars.map((_, i) => 'match'));
  setStep(`<strong>Reversal Complete!</strong> Characters reversed in-place.`);
  setResult(`Reversed String: "${chars.join('')}"`, true);
}

// --------------------------------------------------------------------------
// 3. Palindrome String
// --------------------------------------------------------------------------
async function runPalindrome(chars) {
  setComplexity('O(N)', 'O(1)');
  let left = 0;
  let right = chars.length - 1;
  const matched = {};
  let isPal = true;

  while (left < right) {
    renderArray('canvasArea', chars, { [left]: 'left', [right]: 'right' }, { ...matched, [left]: 'active', [right]: 'active' });
    await controller.step(`Comparing characters: <code>chars[${left}] ('${chars[left]}')</code> vs <code>chars[${right}] ('${chars[right]}')</code>.`);

    if (chars[left] !== chars[right]) {
      renderArray('canvasArea', chars, { [left]: 'mismatch', [right]: 'mismatch' }, { ...matched, [left]: 'mismatch', [right]: 'mismatch' });
      await controller.step(`<strong>Mismatch!</strong> <code>'${chars[left]}' ≠ '${chars[right]}'</code>. String is NOT a palindrome.`);
      isPal = false;
      break;
    }

    matched[left] = 'match';
    matched[right] = 'match';
    renderArray('canvasArea', chars, { [left]: 'match', [right]: 'match' }, { ...matched });
    await controller.step(`<strong>Match!</strong> <code>'${chars[left]}' === '${chars[right]}'</code>.`);

    left++;
    right--;
  }

  if (isPal) {
    if (left === right) matched[left] = 'match';
    renderArray('canvasArea', chars, {}, matched);
    setStep(`<strong>Result: Valid Palindrome!</strong> String reads the same forwards and backwards.`);
    setResult(`"${chars.join('')}" IS a Palindrome!`, true);
  } else {
    setResult(`"${chars.join('')}" is NOT a Palindrome.`, false);
  }
}
