/**
 * ============================================================================
 * js/linkedlist.js - Singly Linked List Visualizations
 * 1. Linked List Traversal
 * 2. Reverse Linked List (In-Place 3 Pointers: prev, curr, next)
 * 3. Palindrome Linked List
 * ============================================================================
 */

let currentNodes = [10, 20, 30, 40, 50];

document.addEventListener('DOMContentLoaded', () => {
  resetVisualization();

  document.getElementById('btnStart').addEventListener('click', startVisualization);
  document.getElementById('btnReset').addEventListener('click', resetVisualization);
  document.getElementById('btnLoad').addEventListener('click', () => {
    currentNodes = parseArrayInput('llInput', [10, 20, 30, 40, 50]);
    resetVisualization();
  });

  document.getElementById('problemSelect').addEventListener('change', () => {
    const prob = document.getElementById('problemSelect').value;
    const inputEl = document.getElementById('llInput');

    if (prob === 'palindrome') {
      inputEl.value = '1, 2, 3, 2, 1';
      currentNodes = [1, 2, 3, 2, 1];
    } else {
      inputEl.value = '10, 20, 30, 40, 50';
      currentNodes = [10, 20, 30, 40, 50];
    }
    resetVisualization();
  });
});

function renderLL(nodes, pointers = {}, highlights = {}, arrows = []) {
  const container = document.getElementById('canvasArea');
  if (!container) return;
  container.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'll-container';

  nodes.forEach((val, idx) => {
    const nodeWrapper = document.createElement('div');
    nodeWrapper.className = 'element-box';

    const innerNode = document.createElement('div');
    innerNode.className = `ll-node ${highlights[idx] || ''}`;

    const valSpan = document.createElement('span');
    valSpan.className = 'll-val';
    valSpan.textContent = val;

    const nextSpan = document.createElement('span');
    nextSpan.className = 'll-next';
    nextSpan.textContent = 'next';

    innerNode.appendChild(valSpan);
    innerNode.appendChild(nextSpan);
    nodeWrapper.appendChild(innerNode);

    // Pointer indicator below
    const ptrDiv = document.createElement('div');
    ptrDiv.className = 'element-pointer';
    if (pointers[idx]) {
      const ptrLabel = pointers[idx];
      let ptrClass = 'ptr-current';
      if (ptrLabel.includes('prev')) ptrClass = 'ptr-left';
      else if (ptrLabel.includes('next')) ptrClass = 'ptr-right';
      else if (ptrLabel.includes('head')) ptrClass = 'ptr-mid';
      ptrDiv.innerHTML = `<span class="${ptrClass}">↑<br>${ptrLabel}</span>`;
    }
    nodeWrapper.appendChild(ptrDiv);

    wrap.appendChild(nodeWrapper);

    // Arrow to next node
    const arrowSpan = document.createElement('span');
    const isReversed = arrows[idx] === 'reversed';
    arrowSpan.className = `ll-arrow ${isReversed ? 'reversed' : ''}`;
    arrowSpan.textContent = isReversed ? '←' : '→';
    wrap.appendChild(arrowSpan);
  });

  // NULL terminator
  const nullDiv = document.createElement('div');
  nullDiv.className = 'element-box';
  const nullBadge = document.createElement('div');
  nullBadge.className = 'll-null';
  nullBadge.textContent = 'NULL';
  nullDiv.appendChild(nullBadge);

  if (pointers[nodes.length] || pointers[-1]) {
    const ptrDiv = document.createElement('div');
    ptrDiv.className = 'element-pointer';
    const label = pointers[nodes.length] || pointers[-1];
    ptrDiv.innerHTML = `<span class="ptr-current">↑<br>${label}</span>`;
    nullDiv.appendChild(ptrDiv);
  }
  wrap.appendChild(nullDiv);

  container.appendChild(wrap);
}

function resetVisualization() {
  controller.reset();
  currentNodes = parseArrayInput('llInput', [10, 20, 30, 40, 50]);
  renderLL(currentNodes, { 0: 'head' });
  setStep('Click <strong>Start</strong> to begin stepping through the algorithm.');
  clearResult();
  setComplexity('O(N)', 'O(1)');
}

async function startVisualization() {
  controller.start();
  clearResult();
  const prob = document.getElementById('problemSelect').value;

  try {
    if (prob === 'traversal') {
      await runTraversal([...currentNodes]);
    } else if (prob === 'reverse') {
      await runReverse([...currentNodes]);
    } else if (prob === 'palindrome') {
      await runPalindrome([...currentNodes]);
    }
  } catch (e) {
    if (e.message !== 'STOPPED') console.error(e);
  } finally {
    controller.finish();
  }
}

// --------------------------------------------------------------------------
// 1. Linked List Traversal
// --------------------------------------------------------------------------
async function runTraversal(nodes) {
  setComplexity('O(N)', 'O(1)');
  const n = nodes.length;
  const visited = {};

  setStep(`Initialize pointer <code>curr = head</code> at node <strong>${nodes[0]}</strong>.`);
  renderLL(nodes, { 0: 'curr' }, { 0: 'active' });
  await controller.sleep();

  for (let i = 0; i < n; i++) {
    renderLL(nodes, { [i]: 'curr' }, { ...visited, [i]: 'active' });
    await controller.step(`Visiting node with value <strong>${nodes[i]}</strong>.`);

    visited[i] = 'match';
    renderLL(nodes, { [i]: 'curr' }, { ...visited });
    await controller.step(`Moving to next node: <code>curr = curr.next</code>.`);
  }

  // curr reached null
  renderLL(nodes, { [n]: 'curr (NULL)' }, visited);
  await controller.step(`<code>curr</code> reached <strong>NULL</strong>. Traversal loop terminates.`);

  renderLL(nodes, {}, visited);
  setStep(`<strong>Linked List Traversal Complete!</strong> Successfully traversed ${n} nodes.`);
  setResult(`Traversed ${n} nodes sequentially!`, true);
}

// --------------------------------------------------------------------------
// 2. Reverse Linked List (3 Pointers: prev, curr, next)
// --------------------------------------------------------------------------
async function runReverse(nodes) {
  setComplexity('O(N)', 'O(1)');
  const n = nodes.length;
  const arrows = new Array(n).fill('normal');
  let prev = -1; // -1 represents NULL
  let curr = 0;

  renderLL(nodes, { 0: 'curr', '-1': 'prev' }, { 0: 'active' }, arrows);
  await controller.step(`Initialize <code>prev = NULL</code> and <code>curr = head</code> (node ${nodes[0]}).`);

  while (curr < n) {
    const nextIdx = curr + 1;
    const nextLabel = nextIdx < n ? `node ${nodes[nextIdx]}` : 'NULL';

    // Step 1: nextNode = curr.next
    const ptrs1 = { [curr]: 'curr' };
    if (prev >= 0) ptrs1[prev] = 'prev';
    if (nextIdx <= n) ptrs1[nextIdx] = 'next';

    renderLL(nodes, ptrs1, { [curr]: 'active' }, arrows);
    await controller.step(`<strong>1. Save next:</strong> <code>next = curr.next</code> (${nextLabel}).`);

    // Step 2: curr.next = prev (redirect arrow)
    arrows[curr] = 'reversed';
    renderLL(nodes, ptrs1, { [curr]: 'compare' }, arrows);
    await controller.step(`<strong>2. Reverse link:</strong> <code>curr.next = prev</code> redirects pointer backwards!`);

    // Step 3: prev = curr
    prev = curr;
    const ptrs2 = { [prev]: 'prev' };
    if (nextIdx <= n) ptrs2[nextIdx] = 'next';
    renderLL(nodes, ptrs2, { [prev]: 'match' }, arrows);
    await controller.step(`<strong>3. Move prev:</strong> <code>prev = curr</code> advances to node ${nodes[prev]}.`);

    // Step 4: curr = nextNode
    curr = nextIdx;
    const ptrs3 = { [prev]: 'prev' };
    if (curr <= n) ptrs3[curr] = 'curr';
    renderLL(nodes, ptrs3, { [prev]: 'match' }, arrows);
    await controller.step(`<strong>4. Move curr:</strong> <code>curr = next</code> advances to ${nextLabel}.`);
  }

  // Done: prev is new head
  renderLL(nodes, { [prev]: 'NEW HEAD' }, nodes.map(() => 'match'), arrows);
  setStep(`<strong>Reversal Complete!</strong> <code>curr</code> is NULL. <code>prev</code> now points to the <strong>new head</strong> (node ${nodes[prev]}).`);
  setResult(`Reversed: New Head is [${nodes[prev]}]`, true);
}

// --------------------------------------------------------------------------
// 3. Palindrome Linked List
// --------------------------------------------------------------------------
async function runPalindrome(nodes) {
  setComplexity('O(N)', 'O(1)');
  const n = nodes.length;
  const mid = Math.floor(n / 2);

  // 1. Find middle with slow and fast
  renderLL(nodes, { [mid]: 'mid (slow)' }, { [mid]: 'active' });
  await controller.step(`Found middle node at index ${mid} (value <strong>${nodes[mid]}</strong>).`);

  // 2. Compare symmetric nodes
  let p1 = 0;
  let p2 = n - 1;
  const matched = {};
  let isPal = true;

  while (p1 <= mid && p2 >= mid) {
    renderLL(nodes, { [p1]: 'p1', [p2]: 'p2' }, { ...matched, [p1]: 'compare', [p2]: 'compare' });
    await controller.step(`Comparing first half node <code>[${nodes[p1]}]</code> vs second half node <code>[${nodes[p2]}]</code>.`);

    if (nodes[p1] !== nodes[p2]) {
      renderLL(nodes, { [p1]: 'mismatch', [p2]: 'mismatch' }, { ...matched, [p1]: 'mismatch', [p2]: 'mismatch' });
      await controller.step(`<strong>Mismatch!</strong> <code>${nodes[p1]} ≠ ${nodes[p2]}</code>. Not a palindrome.`);
      isPal = false;
      break;
    }

    matched[p1] = 'match';
    matched[p2] = 'match';
    renderLL(nodes, { [p1]: 'match', [p2]: 'match' }, { ...matched });
    await controller.step(`<strong>Match!</strong> <code>${nodes[p1]} === ${nodes[p2]}</code>.`);

    p1++;
    p2--;
  }

  if (isPal) {
    renderLL(nodes, {}, matched);
    setStep(`<strong>Result: Valid Palindrome!</strong> Linked list is symmetric.`);
    setResult('Linked List IS a Palindrome!', true);
  } else {
    setResult('Linked List is NOT a Palindrome.', false);
  }
}
