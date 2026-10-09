/**
 * ============================================================================
 * js/slidingwindow.js - Sliding Window Pattern
 * Maximum Sum Subarray of Size K
 * ============================================================================
 */

let swArray = [2, 1, 5, 1, 3, 2];
let windowK = 3;

document.addEventListener('DOMContentLoaded', () => {
  resetVisualization();

  document.getElementById('btnStart').addEventListener('click', startVisualization);
  document.getElementById('btnReset').addEventListener('click', resetVisualization);
  document.getElementById('btnLoad').addEventListener('click', () => {
    swArray = parseArrayInput('arrayInput', [2, 1, 5, 1, 3, 2]);
    windowK = parseInt(document.getElementById('kInput').value, 10) || 3;
    resetVisualization();
  });
});

function renderWindow(arr, winStart, winEnd, customMsg = '') {
  const container = document.getElementById('canvasArea');
  if (!container) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '16px';

  if (customMsg) {
    const banner = document.createElement('div');
    banner.style.padding = '6px 16px';
    banner.style.borderRadius = '4px';
    banner.style.backgroundColor = '#eff6ff';
    banner.style.color = '#1d4ed8';
    banner.style.fontWeight = '700';
    banner.style.fontSize = '0.9rem';
    banner.innerHTML = customMsg;
    wrapper.appendChild(banner);
  }

  const row = document.createElement('div');
  row.className = 'array-container';

  arr.forEach((val, idx) => {
    const box = document.createElement('div');
    box.className = 'element-box';

    const inWindow = idx >= winStart && idx <= winEnd;

    const valDiv = document.createElement('div');
    valDiv.className = `element-val ${inWindow ? 'window-active' : ''}`;
    if (inWindow) valDiv.style.borderColor = '#0284c7';
    valDiv.textContent = val;

    const idxDiv = document.createElement('div');
    idxDiv.className = 'element-idx';
    idxDiv.textContent = `[${idx}]`;

    const ptrDiv = document.createElement('div');
    ptrDiv.className = 'element-pointer';
    if (idx === winStart && inWindow) {
      ptrDiv.innerHTML = '<span class="ptr-left">↑<br>start</span>';
    } else if (idx === winEnd && inWindow) {
      ptrDiv.innerHTML = '<span class="ptr-right">↑<br>end</span>';
    }

    box.appendChild(valDiv);
    box.appendChild(idxDiv);
    box.appendChild(ptrDiv);
    row.appendChild(box);
  });

  wrapper.appendChild(row);
  container.appendChild(wrapper);
}

function resetVisualization() {
  controller.reset();
  swArray = parseArrayInput('arrayInput', [2, 1, 5, 1, 3, 2]);
  windowK = parseInt(document.getElementById('kInput').value, 10) || 3;
  windowK = Math.min(Math.max(1, windowK), swArray.length);
  document.getElementById('kInput').value = windowK;

  renderArray('canvasArea', swArray);
  setStep(`Click <strong>Start</strong> to find maximum sum subarray of size <code>k = ${windowK}</code>.`);
  clearResult();
  setComplexity('O(N)', 'O(1)');
}

async function startVisualization() {
  controller.start();
  clearResult();
  const k = Math.min(Math.max(1, windowK), swArray.length);

  try {
    await runMaxSumSubarray([...swArray], k);
  } catch (e) {
    if (e.message !== 'STOPPED') console.error(e);
  } finally {
    controller.finish();
  }
}

async function runMaxSumSubarray(arr, k) {
  setComplexity('O(N)', 'O(1)');
  const n = arr.length;
  let windowSum = 0;
  let maxSum = 0;

  // 1. Calculate sum of first window
  setStep(`<strong>Step 1:</strong> Summing first <code>k = ${k}</code> elements [0..${k - 1}] to initialize window.`);
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
    renderWindow(arr, 0, i, `Building Window: Adding arr[${i}] = ${arr[i]} | Sum = ${windowSum}`);
    await controller.sleep(600);
  }

  maxSum = windowSum;
  let bestStart = 0;
  let bestEnd = k - 1;

  renderWindow(arr, 0, k - 1, `Initial Window [0..${k - 1}] | Sum = ${windowSum} | Max Sum = ${maxSum}`);
  await controller.step(`First window <code>[0..${k - 1}]</code> complete. Initial <code>maxSum = ${maxSum}</code>.`);

  // 2. Slide the window
  for (let i = k; i < n; i++) {
    const leavingIdx = i - k;
    const leavingVal = arr[leavingIdx];
    const enteringIdx = i;
    const enteringVal = arr[enteringIdx];

    // Show slide action
    renderWindow(arr, leavingIdx + 1, enteringIdx, `Sliding: -${leavingVal} (exits left) & +${enteringVal} (enters right)`);
    await controller.step(`Slide window: Remove <code>arr[${leavingIdx}] (${leavingVal})</code>, Add <code>arr[${enteringIdx}] (${enteringVal})</code>.`);

    windowSum += enteringVal - leavingVal;
    const isNewMax = windowSum > maxSum;
    if (isNewMax) {
      maxSum = windowSum;
      bestStart = leavingIdx + 1;
      bestEnd = enteringIdx;
    }

    renderWindow(arr, leavingIdx + 1, enteringIdx, `Window [${leavingIdx + 1}..${enteringIdx}] | Sum = ${windowSum} | Max = ${maxSum}`);
    await controller.step(`New Window Sum = <code>${windowSum}</code>. ${isNewMax ? `<strong>New Max Found: ${maxSum}!</strong>` : `Max remains ${maxSum}.`}`);
  }

  // Done
  renderWindow(arr, bestStart, bestEnd, `🌟 Maximum Subarray [${bestStart}..${bestEnd}] with Sum = ${maxSum}`);
  setStep(`<strong>Completed!</strong> Maximum sum subarray of size <code>${k}</code> is <strong>${maxSum}</strong> at indices [${bestStart}..${bestEnd}].`);
  setResult(`Max Sum = ${maxSum} (Subarray: [${arr.slice(bestStart, bestEnd + 1).join(', ')}])`, true);
}
