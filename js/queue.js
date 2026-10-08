/**
 * ============================================================================
 * js/queue.js - Queue (FIFO) Visualizations
 * Operations:
 * 1. Enqueue(x) - adds element to REAR
 * 2. Dequeue()  - removes element from FRONT
 * 3. Run Demo   - automated walkthrough showing FIFO flow
 * ============================================================================
 */

let queueItems = [10, 20, 30];

document.addEventListener('DOMContentLoaded', () => {
  render();

  document.getElementById('btnEnqueue').addEventListener('click', handleEnqueue);
  document.getElementById('btnDequeue').addEventListener('click', handleDequeue);
  document.getElementById('btnClearQueue').addEventListener('click', handleClear);
  document.getElementById('btnStartDemo').addEventListener('click', runFullDemo);
});

function render() {
  const container = document.getElementById('canvasArea');
  if (!container) return;
  container.innerHTML = '';

  const n = queueItems.length;

  const wrapper = document.createElement('div');
  wrapper.style.display = 'flex';
  wrapper.style.flexDirection = 'column';
  wrapper.style.alignItems = 'center';
  wrapper.style.gap = '14px';

  // Pipe container
  const pipe = document.createElement('div');
  pipe.className = 'queue-container';

  if (n === 0) {
    pipe.innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem; margin: auto;">Queue is Empty</span>';
  } else {
    queueItems.forEach((val, idx) => {
      const box = document.createElement('div');
      box.className = 'element-box';

      // Pointer above: FRONT pointer
      const topPtr = document.createElement('div');
      topPtr.style.minHeight = '24px';
      topPtr.style.fontSize = '0.8rem';
      topPtr.style.fontWeight = '700';
      topPtr.style.color = 'var(--primary)';
      if (idx === 0) {
        topPtr.innerHTML = 'FRONT ↓';
      }

      // Value Box
      const valDiv = document.createElement('div');
      valDiv.className = 'queue-item';
      valDiv.textContent = val;

      // Pointer below: REAR pointer
      const btmPtr = document.createElement('div');
      btmPtr.style.minHeight = '24px';
      btmPtr.style.fontSize = '0.8rem';
      btmPtr.style.fontWeight = '700';
      btmPtr.style.color = 'var(--accent-active)';
      if (idx === n - 1) {
        btmPtr.innerHTML = '↑ REAR';
      }

      box.appendChild(topPtr);
      box.appendChild(valDiv);
      box.appendChild(btmPtr);
      pipe.appendChild(box);
    });
  }

  wrapper.appendChild(pipe);
  container.appendChild(wrapper);
}

function handleEnqueue() {
  const input = document.getElementById('queueItemInput');
  const val = parseInt(input.value, 10);
  if (isNaN(val)) return;

  if (queueItems.length >= 7) {
    setStep('<strong>Queue Full:</strong> Limit of 7 items reached for display. Dequeue an element first.');
    setResult('Queue is full.', false);
    return;
  }

  queueItems.push(val);
  render();
  setStep(`<strong>enqueue(${val}):</strong> Added element <code>${val}</code> at the <strong>REAR</strong>.`);
  setResult(`Enqueued ${val} at REAR (Size: ${queueItems.length})`, true);
  input.value = Math.floor(Math.random() * 80 + 10);
}

function handleDequeue() {
  if (queueItems.length === 0) {
    setStep('<strong>Queue Underflow:</strong> Cannot dequeue from an empty queue.');
    setResult('Underflow: Queue is empty!', false);
    return;
  }

  const dequeued = queueItems.shift();
  render();
  setStep(`<strong>dequeue():</strong> Removed <code>${dequeued}</code> from the <strong>FRONT</strong> of the queue.`);
  setResult(`Dequeued: ${dequeued} (Remaining: ${queueItems.length})`, true);
}

function handleClear() {
  queueItems = [];
  render();
  setStep('Queue cleared.');
  clearResult();
}

async function runFullDemo() {
  controller.start();
  clearResult();
  queueItems = [];
  render();

  try {
    setStep('Beginning educational Queue (FIFO) demo sequence.');
    await controller.sleep(700);

    // Enqueue 10
    queueItems.push(10);
    render();
    await controller.step('<strong>enqueue(10):</strong> 10 entered queue. It is both FRONT and REAR.');

    // Enqueue 20
    queueItems.push(20);
    render();
    await controller.step('<strong>enqueue(20):</strong> 20 enters at the REAR. 10 stays at FRONT.');

    // Enqueue 30
    queueItems.push(30);
    render();
    await controller.step('<strong>enqueue(30):</strong> 30 enters at the REAR. Queue order is 10 → 20 → 30.');

    // Dequeue
    const d1 = queueItems.shift();
    render();
    await controller.step(`<strong>dequeue():</strong> First element in (<code>${d1}</code>) is first one removed! New FRONT is 20.`);

    // Enqueue 40
    queueItems.push(40);
    render();
    await controller.step('<strong>enqueue(40):</strong> 40 arrives at the REAR behind 30.');

    // Dequeue
    const d2 = queueItems.shift();
    render();
    await controller.step(`<strong>dequeue():</strong> Next element removed from FRONT is <code>${d2}</code>.`);

    setStep('<strong>Demo Complete:</strong> FIFO principle demonstrated — first come, first served!');
    setResult(`Queue current items: [${queueItems.join(', ')}]`, true);
  } catch (e) {
    if (e.message !== 'STOPPED') console.error(e);
  } finally {
    controller.finish();
  }
}
