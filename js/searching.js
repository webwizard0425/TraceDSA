/**
 * js/searching.js - Searching Algorithms
 * 1. Linear Search - O(N)
 * 2. Binary Search - O(log N)
 */

let searchArray = [10, 20, 28, 35, 42, 58, 70];

document.addEventListener('DOMContentLoaded', () => {
  resetVisualization();

  document.getElementById('btnStart').addEventListener('click', startVisualization);
  document.getElementById('btnReset').addEventListener('click', resetVisualization);
  document.getElementById('btnLoad').addEventListener('click', () => {
    searchArray = parseArrayInput('arrayInput', [10, 20, 28, 35, 42, 58, 70]);
    resetVisualization();
  });

  document.getElementById('algorithmSelect').addEventListener('change', () => {
    const algo = document.getElementById('algorithmSelect').value;
    if (algo === 'binary') {
      searchArray.sort((a, b) => a - b);
      document.getElementById('arrayInput').value = searchArray.join(', ');
      setComplexity('O(log N)', 'O(1)');
    } else {
      setComplexity('O(N)', 'O(1)');
    }
    resetVisualization();
  });
});

function resetVisualization() {
  controller.reset();
  const algo = document.getElementById('algorithmSelect').value;
  searchArray = parseArrayInput('arrayInput', [10, 20, 28, 35, 42, 58, 70]);

  if (algo === 'binary') {
    searchArray.sort((a, b) => a - b);
    document.getElementById('arrayInput').value = searchArray.join(', ');
    setComplexity('O(log N)', 'O(1)');
  } else {
    setComplexity('O(N)', 'O(1)');
  }

  renderArray('canvasArea', searchArray);
  setStep('Click <strong>Start</strong> to search for the target value.');
  clearResult();
}

async function startVisualization() {
  controller.start();
  clearResult();
  const algo = document.getElementById('algorithmSelect').value;
  const target = parseInt(document.getElementById('targetInput').value, 10);

  if (isNaN(target)) {
    setStep('Please enter a valid target number.');
    controller.finish();
    return;
  }

  try {
    if (algo === 'linear') {
      await runLinearSearch([...searchArray], target);
    } else if (algo === 'binary') {
      await runBinarySearch([...searchArray], target);
    }
  } catch (e) {
    if (e.message !== 'STOPPED') console.error(e);
  } finally {
    controller.finish();
  }
}

// 1. Linear Search - O(N)
async function runLinearSearch(arr, target) {
  setComplexity('O(N)', 'O(1)');
  const n = arr.length;
  let found = false;
  const visited = {};

  for (let i = 0; i < n; i++) {
    renderArray('canvasArea', arr, { [i]: `Current: index ${i}` }, { ...visited, [i]: 'active' });
    await controller.step(`Checking index ${i}: Is <code>arr[${i}] (${arr[i]}) === target (${target})</code>?`);

    if (arr[i] === target) {
      visited[i] = 'match';
      renderArray('canvasArea', arr, { [i]: 'TARGET FOUND!' }, visited);
      await controller.step(`<strong>TARGET FOUND!</strong> Element <strong>${target}</strong> found at index <strong>${i}</strong>.`);
      setResult(`Found ${target} at index ${i}`, true);
      found = true;
      break;
    } else {
      visited[i] = 'mismatch';
      renderArray('canvasArea', arr, { [i]: '≠ target' }, visited);
      await controller.step(`<code>${arr[i]} ≠ ${target}</code>. Moving to next index...`);
    }
  }

  if (!found) {
    renderArray('canvasArea', arr, {}, visited);
    setStep(`<strong>Search Finished:</strong> Target <strong>${target}</strong> is not in the array.`);
    setResult(`Target ${target} not found.`, false);
  }
}

// 2. Binary Search - O(log N)
async function runBinarySearch(arr, target) {
  setComplexity('O(log N)', 'O(1)');
  let low = 0;
  let high = arr.length - 1;
  let found = false;
  const eliminated = {};

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    renderArray('canvasArea', arr, { [low]: 'low', [mid]: 'mid', [high]: 'high' }, { ...eliminated, [mid]: 'active' });
    await controller.step(`Search interval: [${low}..${high}]. Calculated <code>mid = Math.floor((${low} + ${high}) / 2) = ${mid}</code>.`);

    renderArray('canvasArea', arr, { [low]: 'low', [mid]: 'mid', [high]: 'high' }, { ...eliminated, [mid]: 'compare' });
    await controller.step(`Comparing <code>arr[mid] (${arr[mid]})</code> against <code>target (${target})</code>.`);

    if (arr[mid] === target) {
      renderArray('canvasArea', arr, { [mid]: 'TARGET FOUND!' }, { ...eliminated, [mid]: 'match' });
      await controller.step(`<strong>TARGET FOUND!</strong> <code>arr[${mid}] === ${target}</code> at index <strong>${mid}</strong>.`);
      setResult(`Found ${target} at index ${mid} in O(log N) time!`, true);
      found = true;
      break;
    } else if (arr[mid] < target) {
      // Eliminate left half
      for (let k = low; k <= mid; k++) eliminated[k] = 'mismatch';
      renderArray('canvasArea', arr, { [mid]: 'too small' }, eliminated);
      await controller.step(`<code>${arr[mid]} &lt; ${target}</code>: Target must be in the right half. Eliminating left half. New <code>low = ${mid + 1}</code>.`);
      low = mid + 1;
    } else {
      // Eliminate right half
      for (let k = mid; k <= high; k++) eliminated[k] = 'mismatch';
      renderArray('canvasArea', arr, { [mid]: 'too big' }, eliminated);
      await controller.step(`<code>${arr[mid]} &gt; ${target}</code>: Target must be in the left half. Eliminating right half. New <code>high = ${mid - 1}</code>.`);
      high = mid - 1;
    }
  }

  if (!found) {
    renderArray('canvasArea', arr, {}, eliminated);
    setStep(`<strong>Completed:</strong> <code>low > high</code>. Target <strong>${target}</strong> is not present in the sorted array.`);
    setResult(`Target ${target} not found in array.`, false);
  }
}
