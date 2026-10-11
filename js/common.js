/**
 * ============================================================================
 * js/common.js - Shared Animation Controller & Helper Utilities
 * Designed to be simple, beginner-friendly, and readable.
 * ============================================================================
 */

class VisualizerController {
  constructor() {
    this.isRunning = false;
    this.isPaused = false;
    this.shouldStop = false;
    this.delay = 800; // default medium speed (ms)
  }

  // Set speed based on slider (1 = slow, 2 = medium, 3 = fast)
  setSpeed(val) {
    const v = parseInt(val, 10);
    if (v === 1) this.delay = 1400;      // Slow
    else if (v === 2) this.delay = 800;  // Medium
    else if (v === 3) this.delay = 300;  // Fast
  }

  // Start a new visualization
  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.shouldStop = false;
    this.updateButtonStates();
  }

  // Toggle pause/resume
  togglePause(btn) {
    if (!this.isRunning) return;
    this.isPaused = !this.isPaused;
    if (btn) {
      btn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }
  }

  // Stop / reset current visualization
  reset() {
    this.shouldStop = true;
    this.isRunning = false;
    this.isPaused = false;
    this.updateButtonStates();
    const pauseBtn = document.getElementById('btnPause');
    if (pauseBtn) pauseBtn.textContent = 'Pause';
  }

  // End of run
  finish() {
    this.isRunning = false;
    this.isPaused = false;
    this.updateButtonStates();
    const pauseBtn = document.getElementById('btnPause');
    if (pauseBtn) pauseBtn.textContent = 'Pause';
  }

  updateButtonStates() {
    const btnStart = document.getElementById('btnStart');
    const btnPause = document.getElementById('btnPause');
    const btnReset = document.getElementById('btnReset');

    if (btnStart) btnStart.disabled = this.isRunning;
    if (btnPause) btnPause.disabled = !this.isRunning;
    if (btnReset) btnReset.disabled = false;
  }

  // Sleep function that respects pause and reset
  async sleep(customMs = null) {
    const waitTime = customMs !== null ? customMs : this.delay;
    const start = Date.now();

    while (Date.now() - start < waitTime) {
      if (this.shouldStop) {
        throw new Error('STOPPED');
      }
      // If paused, wait in small 50ms intervals
      while (this.isPaused) {
        if (this.shouldStop) {
          throw new Error('STOPPED');
        }
        await new Promise((res) => setTimeout(res, 50));
      }
      await new Promise((res) => setTimeout(res, 20));
    }
  }

  // Convenient single step that logs message and sleeps
  async step(message) {
    setStep(message);
    await this.sleep();
  }
}

// Global controller instance
const controller = new VisualizerController();

// --------------------------------------------------------------------------
// DOM & Helper Functions
// --------------------------------------------------------------------------

function setStep(message) {
  const el = document.getElementById('stepInfo');
  if (el) el.innerHTML = message;
}

function setResult(message, isSuccess = true) {
  const el = document.getElementById('resultInfo');
  if (el) {
    el.className = isSuccess ? 'result-badge success' : 'result-badge fail';
    el.textContent = message;
    el.style.display = 'inline-block';
  }
}

function clearResult() {
  const el = document.getElementById('resultInfo');
  if (el) {
    el.textContent = '';
    el.style.display = 'none';
  }
}

function setComplexity(time, space) {
  const tEl = document.getElementById('timeComp');
  const sEl = document.getElementById('spaceComp');
  if (tEl) tEl.textContent = time;
  if (sEl) sEl.textContent = space;
}

// Render array boxes with pointer arrows
// pointers: { 0: 'current', 1: 'left', 4: 'right' }
// highlights: { 0: 'active', 1: 'match', 2: 'compare', 3: 'mismatch' }
function renderArray(containerId, arr, pointers = {}, highlights = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const arrayRow = document.createElement('div');
  arrayRow.className = 'array-container';

  arr.forEach((val, idx) => {
    const box = document.createElement('div');
    box.className = 'element-box';

    // Box containing the value
    const valDiv = document.createElement('div');
    valDiv.className = `element-val ${highlights[idx] || ''}`;
    valDiv.textContent = val;

    // Index label below
    const idxDiv = document.createElement('div');
    idxDiv.className = 'element-idx';
    idxDiv.textContent = `[${idx}]`;

    // Pointer indicator below index
    const ptrDiv = document.createElement('div');
    ptrDiv.className = 'element-pointer';
    if (pointers[idx]) {
      const ptrLabel = pointers[idx];
      let ptrClass = 'ptr-current';
      if (ptrLabel.includes('left')) ptrClass = 'ptr-left';
      else if (ptrLabel.includes('right')) ptrClass = 'ptr-right';
      else if (ptrLabel.includes('mid')) ptrClass = 'ptr-mid';

      ptrDiv.innerHTML = `<span class="${ptrClass}">↑<br>${ptrLabel}</span>`;
    }

    box.appendChild(valDiv);
    box.appendChild(idxDiv);
    box.appendChild(ptrDiv);
    arrayRow.appendChild(box);
  });

  container.appendChild(arrayRow);
}

// Parse comma separated array input: "10, 20, 30" -> [10, 20, 30]
function parseArrayInput(inputId, defaultArr = [10, 20, 30, 40, 50]) {
  const el = document.getElementById(inputId);
  if (!el || !el.value.trim()) return [...defaultArr];
  const parts = el.value.split(',').map((x) => x.trim()).filter((x) => x.length > 0);
  if (parts.length === 0) return [...defaultArr];
  return parts.map((x) => (isNaN(x) ? x : Number(x)));
}

// Parse string input: "radar" -> "radar"
function parseStringInput(inputId, defaultStr = 'racecar') {
  const el = document.getElementById(inputId);
  if (!el || !el.value.trim()) return defaultStr;
  return el.value.trim();
}

// Speed slider event binding
document.addEventListener('DOMContentLoaded', () => {
  const speedSlider = document.getElementById('speedSlider');
  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      controller.setSpeed(e.target.value);
    });
  }

  const btnPause = document.getElementById('btnPause');
  if (btnPause) {
    btnPause.addEventListener('click', () => {
      controller.togglePause(btnPause);
    });
  }
});
