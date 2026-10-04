

let tpArray = [1, 3, 4, 6, 8, 11, 15];

document.addEventListener('DOMContentLoaded', () => {
  resetVisualization();

  document.getElementById('btnStart').addEventListener('click', startVisualization);
  document.getElementById('btnReset').addEventListener('click', resetVisualization);
  document.getElementById('btnLoad').addEventListener('click', () => {
    tpArray = parseArrayInput('arrayInput', [1, 3, 4, 6, 8, 11, 15]);
    resetVisualization();
  });

  document.getElementById('problemSelect').addEventListener('change', () => {
    const prob = document.getElementById('problemSelect').value;
    const targetGroup = document.getElementById('targetGroup');
    const inputEl = document.getElementById('arrayInput');

    if (prob === 'twosum') {
      targetGroup.style.display = 'flex';
      inputEl.value = '1, 3, 4, 6, 8, 11, 15';
      tpArray = [1, 3, 4, 6, 8, 11, 15];
    } else if (prob === 'palindrome') {
      targetGroup.style.display = 'none';
      inputEl.value = '1, 2, 3, 2, 1';
      tpArray = [1, 2, 3, 2, 1];
    } else {
      targetGroup.style.display = 'none';
      inputEl.value = '10, 20, 30, 40, 50, 60';
      tpArray = [10, 20, 30, 40, 50, 60];
    }
    resetVisualization();
  });
});

function resetVisualization() {
  controller.reset();
  const prob = document.getElementById('problemSelect').value;
  tpArray = parseArrayInput('arrayInput', [1, 3, 4, 6, 8, 11, 15]);

  if (prob === 'twosum') {
    tpArray.sort((a, b) => a - b);
    document.getElementById('arrayInput').value = tpArray.join(', ');
  }

  renderArray('canvasArea', tpArray);
  setStep('Click <strong>Start</strong> to begin stepping through the two-pointer algorithm.');
  clearResult();
  setComplexity('O(N)', 'O(1)');
}

async function startVisualization() {
  controller.start();
  clearResult();
  const prob = document.getElementById('problemSelect').value;

  try {
    if (prob === 'twosum') {
      const target = parseInt(document.getElementById('targetInput').value, 10) || 14;
      await runTwoSum([...tpArray], target);
    } else if (prob === 'reverse') {
      await runReverse([...tpArray]);
    } else if (prob === 'palindrome') {
      await runPalindrome([...tpArray]);
    }
  } catch (e) {
    if (e.message !== 'STOPPED') console.error(e);
  } finally {
    controller.finish();
  }
}

// --------------------------------------------------------------------------
// 1. Two Sum in Sorted Array
// --------------------------------------------------------------------------
async function runTwoSum(arr, target) {
  setComplexity('O(N)', 'O(1)');
  let left = 0;
  let right = arr.length - 1;
  let found = false;

  while (left < right) {
    const sum = arr[left] + arr[right];

    renderArray('canvasArea', arr, { [left]: 'left', [right]: 'right' }, { [left]: 'compare', [right]: 'compare' });
    await controller.step(`Sum: <code>arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${sum}</code>. Target = <strong>${target}</strong>.`);

    if (sum === target) {
      renderArray('canvasArea', arr, { [left]: 'FOUND!', [right]: 'FOUND!' }, { [left]: 'match', [right]: 'match' });
      await controller.step(`<strong>Target Found!</strong> <code>${arr[left]} + ${arr[right]} === ${target}</code> at indices [${left}, ${right}].`);
      setResult(`Pair Found: arr[${left}] (${arr[left]}) + arr[${right}] (${arr[right]}) = ${target}`, true);
      found = true;
      break;
    } else if (sum < target) {
      renderArray('canvasArea', arr, { [left]: 'left ➔', [right]: 'right' }, { [left]: 'mismatch', [right]: 'compare' });
      await controller.step(`Sum (<code>${sum}</code>) is <strong>less than</strong> target (${target}). Increment <code>left++</code> to increase sum.`);
      left++;
    } else {
      renderArray('canvasArea', arr, { [left]: 'left', [right]: '◀ right' }, { [left]: 'compare', [right]: 'mismatch' });
      await controller.step(`Sum (<code>${sum}</code>) is <strong>greater than</strong> target (${target}). Decrement <code>right--</code> to decrease sum.`);
      right--;
    }
  }

  if (!found) {
    renderArray('canvasArea', arr);
    setStep(`<strong>Completed:</strong> Pointers met. No pair found that sums to ${target}.`);
    setResult(`No pair found for target ${target}`, false);
  }
}

// --------------------------------------------------------------------------
// 2. Reverse Array
// --------------------------------------------------------------------------
async function runReverse(arr) {
  setComplexity('O(N)', 'O(1)');
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    renderArray('canvasArea', arr, { [left]: 'left', [right]: 'right' }, { [left]: 'active', [right]: 'active' });
    await controller.step(`Two pointers at <code>left = ${left} (${arr[left]})</code> and <code>right = ${right} (${arr[right]})</code>.`);

    // Swap
    const temp = arr[left];
    arr[left] = arr[right];
    arr[right] = temp;

    renderArray('canvasArea', arr, { [left]: 'swapped', [right]: 'swapped' }, { [left]: 'match', [right]: 'match' });
    await controller.step(`Swapped values. Now <code>arr[${left}] = ${arr[left]}</code> and <code>arr[${right}] = ${arr[right]}</code>.`);

    left++;
    right--;
  }

  renderArray('canvasArea', arr, {}, arr.map(() => 'match'));
  setStep(`<strong>Reverse Complete!</strong> Entire array reversed in-place.`);
  setResult(`Reversed Array: [${arr.join(', ')}]`, true);
}

// --------------------------------------------------------------------------
// 3. Palindrome Check
// --------------------------------------------------------------------------
async function runPalindrome(arr) {
  setComplexity('O(N)', 'O(1)');
  let left = 0;
  let right = arr.length - 1;
  const matched = {};
  let isPal = true;

  while (left < right) {
    renderArray('canvasArea', arr, { [left]: 'left', [right]: 'right' }, { ...matched, [left]: 'compare', [right]: 'compare' });
    await controller.step(`Comparing <code>arr[${left}] = ${arr[left]}</code> vs <code>arr[${right}] = ${arr[right]}</code>.`);

    if (arr[left] !== arr[right]) {
      renderArray('canvasArea', arr, { [left]: 'mismatch', [right]: 'mismatch' }, { ...matched, [left]: 'mismatch', [right]: 'mismatch' });
      await controller.step(`<strong>Mismatch!</strong> <code>${arr[left]} ≠ ${arr[right]}</code>. Not a palindrome.`);
      isPal = false;
      break;
    }

    matched[left] = 'match';
    matched[right] = 'match';
    renderArray('canvasArea', arr, { [left]: 'match', [right]: 'match' }, { ...matched });
    await controller.step(`<strong>Match!</strong> Both elements equal ${arr[left]}. Advancing inward.`);

    left++;
    right--;
  }

  if (isPal) {
    if (left === right) matched[left] = 'match';
    renderArray('canvasArea', arr, {}, matched);
    setStep(`<strong>Result: Valid Palindrome!</strong>`);
    setResult('Array IS a Palindrome!', true);
  } else {
    setResult('Array is NOT a Palindrome.', false);
  }
}
