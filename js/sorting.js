/**
 * ============================================================================
 * js/sorting.js - Sorting Algorithms
 * 1. Bubble Sort    - O(N²) Time, O(1) Space
 * 2. Selection Sort - O(N²) Time, O(1) Space
 * 3. Insertion Sort - O(N²) Time, O(1) Space
 * ============================================================================
 */

let sortArray = [45, 12, 89, 34, 23, 7];

document.addEventListener('DOMContentLoaded', () => {
  resetVisualization();

  document.getElementById('btnStart').addEventListener('click', startVisualization);
  document.getElementById('btnReset').addEventListener('click', resetVisualization);
  document.getElementById('btnLoad').addEventListener('click', () => {
    sortArray = parseArrayInput('arrayInput', [45, 12, 89, 34, 23, 7]);
    resetVisualization();
  });

  document.getElementById('btnRandom').addEventListener('click', () => {
    const len = 6;
    sortArray = Array.from({ length: len }, () => Math.floor(Math.random() * 85 + 5));
    document.getElementById('arrayInput').value = sortArray.join(', ');
    resetVisualization();
  });

  document.getElementById('algoSelect').addEventListener('change', () => {
    resetVisualization();
  });
});

function resetVisualization() {
  controller.reset();
  sortArray = parseArrayInput('arrayInput', [45, 12, 89, 34, 23, 7]);
  renderArray('canvasArea', sortArray);

  const algo = document.getElementById('algoSelect').value;
  let algoName = 'Bubble Sort';
  if (algo === 'selectionsort') algoName = 'Selection Sort';
  else if (algo === 'insertionsort') algoName = 'Insertion Sort';

  setStep(`Click <strong>Start</strong> to begin ${algoName}.`);
  clearResult();
  setComplexity('O(N²)', 'O(1)');
}

async function startVisualization() {
  controller.start();
  clearResult();
  const algo = document.getElementById('algoSelect').value;

  try {
    if (algo === 'bubblesort') {
      await runBubbleSort([...sortArray]);
    } else if (algo === 'selectionsort') {
      await runSelectionSort([...sortArray]);
    } else if (algo === 'insertionsort') {
      await runInsertionSort([...sortArray]);
    }
  } catch (e) {
    if (e.message !== 'STOPPED') console.error(e);
  } finally {
    controller.finish();
  }
}

// --------------------------------------------------------------------------
// 1. Bubble Sort
// --------------------------------------------------------------------------
async function runBubbleSort(arr) {
  setComplexity('O(N²)', 'O(1)');
  const n = arr.length;
  const sortedIndices = {};

  setStep(`Starting Bubble Sort on ${n} elements. Largest unsorted elements bubble to the right.`);
  await controller.sleep(600);

  for (let i = 0; i < n - 1; i++) {
    let swappedAny = false;
    setStep(`<strong>--- Pass ${i + 1} of ${n - 1} ---</strong>`);
    await controller.sleep(400);

    for (let j = 0; j < n - i - 1; j++) {
      renderArray(
        'canvasArea',
        arr,
        { [j]: 'j', [j + 1]: 'j+1' },
        { ...sortedIndices, [j]: 'compare', [j + 1]: 'compare' }
      );
      await controller.step(`Comparing <code>arr[${j}] (${arr[j]})</code> and <code>arr[${j + 1}] (${arr[j + 1]})</code>.`);

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swappedAny = true;

        renderArray(
          'canvasArea',
          arr,
          { [j]: 'swapped', [j + 1]: 'swapped' },
          { ...sortedIndices, [j]: 'match', [j + 1]: 'match' }
        );
        await controller.step(`<code>${temp} &gt; ${arr[j]}</code> ➔ <strong>Swap!</strong> Moved ${temp} to index ${j + 1}.`);
      } else {
        await controller.step(`<code>${arr[j]} &le; ${arr[j + 1]}</code> ➔ In order. No swap.`);
      }
    }

    const lockedIdx = n - 1 - i;
    sortedIndices[lockedIdx] = 'match';
    renderArray('canvasArea', arr, { [lockedIdx]: 'SORTED' }, sortedIndices);
    await controller.step(`<strong>Pass ${i + 1} Finished:</strong> Element <code>${arr[lockedIdx]}</code> is locked in sorted position.`);

    if (!swappedAny) {
      setStep('<strong>Early Exit:</strong> No swaps occurred during this pass. Array is already completely sorted!');
      break;
    }
  }

  for (let k = 0; k < n; k++) sortedIndices[k] = 'match';
  renderArray('canvasArea', arr, {}, sortedIndices);
  setStep(`<strong>Bubble Sort Complete!</strong> Entire array is now sorted.`);
  setResult(`Sorted Array: [${arr.join(', ')}]`, true);
}

// --------------------------------------------------------------------------
// 2. Selection Sort
// --------------------------------------------------------------------------
async function runSelectionSort(arr) {
  setComplexity('O(N²)', 'O(1)');
  const n = arr.length;
  const sortedIndices = {};

  setStep(`Starting Selection Sort on ${n} elements. In each pass, find the smallest remaining element and swap it to the front.`);
  await controller.sleep(600);

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    setStep(`<strong>--- Pass ${i + 1}: Finding minimum element for index ${i} ---</strong>`);
    await controller.sleep(400);

    renderArray(
      'canvasArea',
      arr,
      { [i]: 'current (i)', [minIdx]: 'min' },
      { ...sortedIndices, [i]: 'active', [minIdx]: 'active' }
    );
    await controller.step(`Assuming minimum element is <code>arr[${i}] (${arr[i]})</code> at index ${i}.`);

    for (let j = i + 1; j < n; j++) {
      renderArray(
        'canvasArea',
        arr,
        { [i]: 'i', [minIdx]: 'min', [j]: 'j' },
        { ...sortedIndices, [minIdx]: 'active', [j]: 'compare' }
      );
      await controller.step(`Scanning: Comparing <code>arr[${j}] (${arr[j]})</code> with current min <code>arr[${minIdx}] (${arr[minIdx]})</code>.`);

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        renderArray(
          'canvasArea',
          arr,
          { [i]: 'i', [minIdx]: 'NEW MIN' },
          { ...sortedIndices, [i]: 'active', [minIdx]: 'match' }
        );
        await controller.step(`<strong>New Minimum Found!</strong> <code>${arr[minIdx]}</code> at index ${minIdx}.`);
      }
    }

    if (minIdx !== i) {
      // Swap arr[i] with arr[minIdx]
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      renderArray(
        'canvasArea',
        arr,
        { [i]: 'swapped', [minIdx]: 'swapped' },
        { ...sortedIndices, [i]: 'match', [minIdx]: 'match' }
      );
      await controller.step(`Swapping minimum <code>${arr[i]}</code> into position ${i} with <code>${arr[minIdx]}</code>.`);
    } else {
      await controller.step(`Minimum element was already at index ${i}. No swap needed.`);
    }

    sortedIndices[i] = 'match';
    renderArray('canvasArea', arr, { [i]: 'SORTED' }, sortedIndices);
    await controller.step(`Index ${i} (value <strong>${arr[i]}</strong>) is now sorted.`);
  }

  for (let k = 0; k < n; k++) sortedIndices[k] = 'match';
  renderArray('canvasArea', arr, {}, sortedIndices);
  setStep(`<strong>Selection Sort Complete!</strong> All elements in ascending order.`);
  setResult(`Sorted Array: [${arr.join(', ')}]`, true);
}

// --------------------------------------------------------------------------
// 3. Insertion Sort
// --------------------------------------------------------------------------
async function runInsertionSort(arr) {
  setComplexity('O(N²)', 'O(1)');
  const n = arr.length;
  const sortedIndices = { 0: 'match' };

  setStep(`Starting Insertion Sort on ${n} elements. Building sorted portion one element at a time from left to right.`);
  renderArray('canvasArea', arr, { 0: 'sorted' }, sortedIndices);
  await controller.step(`Single element <code>arr[0] (${arr[0]})</code> is trivially sorted.`);

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    renderArray(
      'canvasArea',
      arr,
      { [i]: `key = ${key}` },
      { ...sortedIndices, [i]: 'active' }
    );
    await controller.step(`<strong>--- Step ${i}: Pick key = arr[${i}] (${key}) ---</strong> to insert into sorted prefix [0..${i - 1}].`);

    while (j >= 0 && arr[j] > key) {
      renderArray(
        'canvasArea',
        arr,
        { [j]: `arr[${j}] > key`, [j + 1]: 'shift ➔' },
        { ...sortedIndices, [j]: 'compare', [j + 1]: 'compare' }
      );
      await controller.step(`<code>arr[${j}] (${arr[j]}) &gt; key (${key})</code>: Shifting <code>${arr[j]}</code> to the right.`);

      arr[j + 1] = arr[j];
      j--;

      renderArray('canvasArea', arr, { [j + 1]: 'shifted' }, { ...sortedIndices });
      await controller.sleep(300);
    }

    arr[j + 1] = key;
    sortedIndices[j + 1] = 'match';
    for (let k = 0; k <= i; k++) sortedIndices[k] = 'match';

    renderArray(
      'canvasArea',
      arr,
      { [j + 1]: `inserted ${key}` },
      sortedIndices
    );
    await controller.step(`Inserted <code>key = ${key}</code> at correct position (index ${j + 1}). Prefix [0..${i}] is now sorted!`);
  }

  for (let k = 0; k < n; k++) sortedIndices[k] = 'match';
  renderArray('canvasArea', arr, {}, sortedIndices);
  setStep(`<strong>Insertion Sort Complete!</strong> Entire array is sorted.`);
  setResult(`Sorted Array: [${arr.join(', ')}]`, true);
}
