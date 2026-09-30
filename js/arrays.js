/*
 * 1. Array Traversal (Loop)
 * 2. Reverse Array
 * 3. Palindrome Array
 * 4. Find Maximum Element
 */

let currentArray = [10, 20, 30, 40, 50];
// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  resetVisualization();

  document.getElementById('btnStart').addEventListener('click', startVisualization);
  document.getElementById('btnReset').addEventListener('click', resetVisualization);
  document.getElementById('btnLoad').addEventListener('click', () => {
    currentArray = parseArrayInput('arrayInput', [10, 20, 30, 40, 50]);
    resetVisualization();
  });

  document.getElementById('problemSelect').addEventListener('change', () => {
    const prob = document.getElementById('problemSelect').value;
    const inputEl = document.getElementById('arrayInput');

    if (prob === 'palindrome') {
      inputEl.value = '1, 2, 3, 2, 1';
      currentArray = [1, 2, 3, 2, 1];
    } else if (prob === 'maxElement') {
      inputEl.value = '12, 45, 7, 89, 23, 56';
      currentArray = [12, 45, 7, 89, 23, 56];
    } else {
      inputEl.value = '10, 20, 30, 40, 50';
      currentArray = [10, 20, 30, 40, 50];
    }
    resetVisualization();
  });
});

function resetVisualization() {
  controller.reset();
  currentArray = parseArrayInput('arrayInput', [10, 20, 30, 40, 50]);
  renderArray('canvasArea', currentArray);
  setStep('Click <strong>Start</strong> to begin stepping through the algorithm.');
  clearResult();

  const prob = document.getElementById('problemSelect').value;
  updateComplexity(prob);
}

function updateComplexity(prob) {
  if (prob === 'traversal') setComplexity('O(N)', 'O(1)');
  else if (prob === 'reverse') setComplexity('O(N)', 'O(1)');
  else if (prob === 'palindrome') setComplexity('O(N)', 'O(1)');
  else if (prob === 'maxElement') setComplexity('O(N)', 'O(1)');
}

async function startVisualization() {
  controller.start();
  clearResult();
  const prob = document.getElementById('problemSelect').value;

  try {
    if (prob === 'traversal') {
      await runTraversal([...currentArray]);
    } else if (prob === 'reverse') {
      await runReverse([...currentArray]);
    } else if (prob === 'palindrome') {
      await runPalindrome([...currentArray]);
    } else if (prob === 'maxElement') {
      await runMaxElement([...currentArray]);
    }
  } catch (e) {
    if (e.message !== 'STOPPED') console.error(e);
  } finally {
    controller.finish();
  }
}

// 1. Array Traversal
async function runTraversal(arr) {
  setComplexity('O(N)', 'O(1)');
  const n = arr.length;
  const visited = {};

  for (let i = 0; i < n; i++) {
    // Current pointer at index i
    renderArray('canvasArea', arr, { [i]: `Current: index ${i}` }, { ...visited, [i]: 'active' });
    await controller.step(`Visiting <strong>index ${i}</strong>: Value = <code>${arr[i]}</code>.`);

    visited[i] = 'match';
    renderArray('canvasArea', arr, { [i]: `Visited` }, { ...visited });
    await controller.sleep(200);
  }

  renderArray('canvasArea', arr, {}, visited);
  setStep('<strong>Traversal Completed!</strong> All elements visited in linear order.');
  setResult(`Traversed all ${n} elements successfully!`, true);
}

// 2. Reverse Array (Two Pointers)
async function runReverse(arr) {
  setComplexity('O(N)', 'O(1)');
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // Show left and right pointers
    renderArray('canvasArea', arr, { [left]: 'left', [right]: 'right' }, { [left]: 'compare', [right]: 'compare' });
    await controller.step(`Pointers at <code>left = ${left}</code> (${arr[left]}) and <code>right = ${right}</code> (${arr[right]}). Preparing to swap.`);

    // Swap
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;

    // Show swapped state
    renderArray('canvasArea', arr, { [left]: 'swapped', [right]: 'swapped' }, { [left]: 'match', [right]: 'match' });
    await controller.step(`Swapped <code>arr[${left}]</code> and <code>arr[${right}]</code>.`);

    left++;
    right--;
  }

  renderArray('canvasArea', arr, {}, arr.map((_, i) => 'match'));
  setStep('<strong>Reversal Complete!</strong> Array elements are now reversed in-place.');
  setResult(`Reversed array: [${arr.join(', ')}]`, true);
}

// 3. Palindrome Array
async function runPalindrome(arr) {
  setComplexity('O(N)', 'O(1)');
  let left = 0;
  let right = arr.length - 1;
  const matched = {};
  let isPal = true;

  while (left < right) {
    renderArray('canvasArea', arr, { [left]: 'left', [right]: 'right' }, { ...matched, [left]: 'active', [right]: 'active' });
    await controller.step(`Comparing outer elements: <code>arr[${left}] = ${arr[left]}</code> vs <code>arr[${right}] = ${arr[right]}</code>.`);

    if (arr[left] !== arr[right]) {
      renderArray('canvasArea', arr, { [left]: 'mismatch', [right]: 'mismatch' }, { ...matched, [left]: 'mismatch', [right]: 'mismatch' });
      await controller.step(`<strong>Mismatch detected!</strong> <code>${arr[left]} ≠ ${arr[right]}</code>. The array is NOT a palindrome.`);
      isPal = false;
      break;
    }

    matched[left] = 'match';
    matched[right] = 'match';
    renderArray('canvasArea', arr, { [left]: 'match', [right]: 'match' }, { ...matched });
    await controller.step(`<strong>Match!</strong> <code>${arr[left]} === ${arr[right]}</code>. Moving pointers inward.`);

    left++;
    right--;
  }

  if (isPal) {
    if (left === right) matched[left] = 'match';
    renderArray('canvasArea', arr, {}, matched);
    setStep('<strong>Palindrome Check Complete:</strong> All symmetric pairs match.');
    setResult('Array IS a valid Palindrome!', true);
  } else {
    setResult('Array is NOT a Palindrome.', false);
  }
}
// 4. Find Maximum Element
async function runMaxElement(arr) {
  setComplexity('O(N)', 'O(1)');
  let maxVal = arr[0];
  let maxIdx = 0;
  const highlights = { 0: 'match' };

  renderArray('canvasArea', arr, { 0: 'max so far' }, highlights);
  await controller.step(`Initialized <code>max = arr[0] (${arr[0]})</code> at index 0.`);

  for (let i = 1; i < arr.length; i++) {
    renderArray('canvasArea', arr, { [maxIdx]: 'max', [i]: 'current' }, { ...highlights, [i]: 'active' });
    await controller.step(`Checking index ${i}: Is <code>arr[${i}] (${arr[i]}) > current max (${maxVal})</code>?`);

    if (arr[i] > maxVal) {
      delete highlights[maxIdx];
      maxVal = arr[i];
      maxIdx = i;
      highlights[maxIdx] = 'match';

      renderArray('canvasArea', arr, { [maxIdx]: 'NEW MAX' }, highlights);
      await controller.step(`<strong>New Maximum Found!</strong> Updated <code>max = ${maxVal}</code> at index ${maxIdx}.`);
    } else {
      await controller.step(`No change: <code>${arr[i]} &le; ${maxVal}</code>.`);
    }
  }

  renderArray('canvasArea', arr, { [maxIdx]: 'MAXIMUM' }, highlights);
  setStep(`<strong>Completed!</strong> Maximum element is <strong>${maxVal}</strong> found at index <strong>${maxIdx}</strong>.`);
  setResult(`Maximum Value = ${maxVal} (at index ${maxIdx})`, true);
}
