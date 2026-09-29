# ⚡ TraceDSA

**TraceDSA** is a simple, beginner-friendly Data Structures and Algorithms visualizer built with **pure HTML, CSS, and Vanilla JavaScript**.

Designed specifically for students and beginners, **TraceDSA** allows you to trace algorithms step-by-step with real-time pointers (`current`, `left`, `right`, `mid`), container states, and plain-English explanations.

---

## 🚀 Quick Start

No installations, build steps, or server dependencies needed:

1. Clone or download this folder.
2. Open `index.html` in any web browser (Chrome, Edge, Firefox, Brave, Safari).
3. Select any topic to begin visualizing!

---

## 📂 Project Architecture

```text
TraceDSA/
│
├── index.html                   # Main dashboard linking to all topics
├── css/
│   └── style.css                # Shared clean stylesheet
│
├── pages/
│   ├── arrays.html              # Array Traversal, Reverse, Palindrome, Max Element
│   ├── strings.html             # String Traversal, Reverse String, Palindrome String
│   ├── linkedlist.html          # Linked List Traversal, Reverse LL, Palindrome LL
│   ├── stack.html               # Stack (LIFO): Push, Pop, Peek & Full Demo
│   ├── queue.html               # Queue (FIFO): Enqueue, Dequeue & Full Demo
│   ├── twopointers.html         # Two Sum (Sorted), Reverse Array, Palindrome Check
│   ├── slidingwindow.html       # Maximum Sum Subarray of Size K
│   ├── searching.html           # Linear Search & Binary Search
│   └── sorting.html             # Bubble Sort, Selection Sort & Insertion Sort
│
└── js/
    ├── common.js                # Playback controller (Start, Pause, Reset, Speed)
    ├── arrays.js                # Array logic & animations
    ├── strings.js               # String logic & animations
    ├── linkedlist.js            # Linked list logic & pointer hops
    ├── stack.js                 # Stack operations (vertical canister + TOP indicator)
    ├── queue.js                 # Queue operations (horizontal conduit + FRONT & REAR)
    ├── twopointers.js           # Two Pointers logic (left & right)
    ├── slidingwindow.js         # Sliding Window logic (window frame + sums)
    ├── searching.js             # Linear & Binary Search logic
    └── sorting.js               # Bubble, Selection & Insertion sort logic
```

---

## 🎯 Features

* **Visual Pointer Tracking:** Watch `current`, `left`, `right`, `mid`, `slow`, and `fast` pointers move in real-time.
* **Step-by-Step Playback:** Full control with **Start**, **Pause / Resume**, **Reset**, and **Speed Slider**.
* **Custom Inputs:** Enter your own custom numbers, strings, or targets.
* **Step Explanations:** Explains what happens at each step in plain English.
* **Time & Space Complexity:** Complexity badges on every page for quick revision.
* **100% Dependency-Free:** Zero external libraries or frameworks—clean, pure Vanilla JS.

---

## 📄 License
Open source & educational college project.
