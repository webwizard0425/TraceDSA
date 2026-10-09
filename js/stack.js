/**
 * ============================================================================
 * js/stack.js - Stack (LIFO) Visualizations
 * Operations:
 * 1. Push(x)  - adds element to TOP
 * 2. Pop()    - removes element from TOP
 * 3. Peek()   - views TOP element without removing
 * 4. Run Demo - automated educational walkthrough
 * ============================================================================
 */

let stackItems = [10, 20, 30];

document.addEventListener('DOMContentLoaded', () => {
  render();

  document.getElementById('btnPush').addEventListener('click', handlePush);
  document.getElementById('btnPop').addEventListener('click', handlePop);
  document.getElementById('btnPeek').addEventListener('click', handlePeek);
  document.getElementById('btnClearStack').addEventListener('click', handleClear);
  document.getElementById('btnStartDemo').addEventListener('click', runFullDemo);
});

function render(highlightTop = false, actionMsg = '') {
  const container = document.getElementById('canvasArea');
  if (!container) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '20px';

  // Vertical vessel
  const vessel = document.createElement('div');
  vessel.className = 'stack-container';

  const n = stackItems.length;

  if (n === 0) {
    vessel.innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem; margin: auto;">Stack is Empty</span>';
  } else {
    stackItems.forEach((val, idx) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'stack-item';
      if (idx === n - 1) {
        itemDiv.classList.add('top-item');
      }
      itemDiv.textContent = val;
      vessel.appendChild(itemDiv);
    });
  }

  wrapper.appendChild(vessel);

  // TOP Pointer indicator
  if (n > 0) {
    const topIndicator = document.createElement('div');
    topIndicator.style.display = 'flex';
    topIndicator.style.flexDirection = 'column';
    topIndicator.style.color = 'var(--accent-active)';
    topIndicator.style.fontWeight = '700';
    topIndicator.style.fontSize = '0.9rem';
    topIndicator.innerHTML = `<span>← TOP (Index: ${n - 1})</span><span style="font-size: 0.8rem; color: var(--text-muted);">Value = ${stackItems[n - 1]}</span>`;
    wrapper.appendChild(topIndicator);
  }

  container.appendChild(wrapper);
}

function handlePush() {
  const input = document.getElementById('stackItemInput');
  const val = parseInt(input.value, 10);
  if (isNaN(val)) return;

  if (stackItems.length >= 6) {
    setStep('<strong>Stack Overflow:</strong> Container reached max capacity (6 items). Pop an item first.');
    setResult('Overflow: Cannot push to full stack.', false);
    return;
  }

  stackItems.push(val);
  render(true);
  setStep(`<strong>push(${val}):</strong> Added element <code>${val}</code> to the TOP of the stack.`);
  setResult(`Pushed ${val} onto Stack (New size: ${stackItems.length})`, true);
  input.value = Math.floor(Math.random() * 80 + 10);
}

function handlePop() {
  if (stackItems.length === 0) {
    setStep('<strong>Stack Underflow:</strong> Cannot pop from an empty stack.');
    setResult('Underflow: Stack is empty!', false);
    return;
  }

  const popped = stackItems.pop();
  render();
  setStep(`<strong>pop():</strong> Removed top element <code>${popped}</code> from the stack.`);
  setResult(`Popped value: ${popped} (Remaining: ${stackItems.length})`, true);
}

function handlePeek() {
  if (stackItems.length === 0) {
    setStep('<strong>peek():</strong> Stack is empty. Nothing to inspect.');
    setResult('Stack is empty.', false);
    return;
  }

  const topVal = stackItems[stackItems.length - 1];
  render(true);
  setStep(`<strong>peek():</strong> The current TOP element is <code>${topVal}</code>.`);
  setResult(`Top element is: ${topVal}`, true);
}

function handleClear() {
  stackItems = [];
  render();
  setStep('Stack cleared.');
  clearResult();
}

async function runFullDemo() {
  controller.start();
  clearResult();
  stackItems = [];
  render();

  try {
    setStep('Beginning educational Stack (LIFO) demo sequence.');
    await controller.sleep(700);

    // Push 10
    stackItems.push(10);
    render(true);
    await controller.step('<strong>push(10):</strong> 10 pushed onto empty stack.');

    // Push 20
    stackItems.push(20);
    render(true);
    await controller.step('<strong>push(20):</strong> 20 pushed on top of 10.');

    // Push 30
    stackItems.push(30);
    render(true);
    await controller.step('<strong>push(30):</strong> 30 pushed on top of 20. TOP is now 30.');

    // Peek
    render(true);
    await controller.step('<strong>peek():</strong> Checking top element without removing it. Returns 30.');

    // Pop
    const popped = stackItems.pop();
    render(true);
    await controller.step(`<strong>pop():</strong> Removes <code>${popped}</code> from top. New TOP is 20!`);

    // Push 40
    stackItems.push(40);
    render(true);
    await controller.step('<strong>push(40):</strong> Added 40 onto top of 20.');

    setStep('<strong>Demo Complete:</strong> Notice how elements follow Last-In, First-Out (LIFO)!');
    setResult(`Stack final elements: [${stackItems.join(', ')}]`, true);
  } catch (e) {
    if (e.message !== 'STOPPED') console.error(e);
  } finally {
    controller.finish();
  }
}
