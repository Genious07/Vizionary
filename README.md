# Vizionary — See the World Through Words

> **Vision-first • Privacy-conscious • CPU-friendly inference**

Vizionary is a production-minded image & video narration system that turns webcam streams, uploaded images, and short video clips into human-friendly textual descriptions and explainable visual overlays. It’s engineered to deliver low-latency, real-world performance on modest infrastructure (2 vCPU, 16 GB RAM) while keeping developer ergonomics, reproducibility, and privacy at the core.

---

## TL;DR

* **What:** Ultra-efficient Vision → Text service that streams contextual sentences and Grad-CAM style overlays every \~10–12s for live/video/image inputs ON CPU.
* **Stack:** Next.js + Shadcn UI + Tailwind (frontend) ● FastAPI + WebSocket streaming (backend) ● PyTorch/Timm training pipeline (model) ● Gradio demo & Hugging Face deployment utilities.
* **Scale target:** Optimized for **CPU inference** (2 vCPU, 16 GB RAM) with CPU export options (TorchScript, ONNX, quantized flows).
* **Why it matters:** Accessibility, surveillance automation, faster content workflows, and developer-facing explainability.

---

## Table of Contents

1. [Core Features](#core-features)
2. [Project Highlights](#project-highlights)
3. [Architecture (high-level)](#architecture-high-level)
4. [Quickstart — Run the app locally](#quickstart)

   * [Frontend](#frontend)
   * [Backend & Demo](#backend--demo)
5. [Train / Evaluate / Export (Colab-ready)](#train--evaluate--export-colab-ready)
6. [Deployment](#deployment)

   * [Hugging Face (model + Space)](#hugging-face-model--space)
   * [Docker / Cloud](#docker--cloud)
7. [API & WebSocket contract](#api--websocket-contract)
8. [Performance & Optimization Tips](#performance--optimization-tips)
9. [Security, Privacy & Responsible Use](#security-privacy--responsible-use)
10. [Project Layout](#project-layout)
11. [Troubleshooting & FAQ](#troubleshooting--faq)
12. [Contributing & Code Review Guidelines](#contributing--code-review-guidelines)
13. [License & Acknowledgements](#license--acknowledgements)
14. [Contact & Next Steps](#contact--next-steps)

---

## Core Features

* **Real-time streaming narration:** Produces contextual textual descriptions from webcam or uploaded media, updating every \~10–12 seconds.
* **Explainability:** Grad-CAM style overlays + textual cues so you can see what the model attends to.
* **CPU-friendly exports:** TorchScript and ONNX exports with quantization options for efficient CPU inference.
* **Modular pipeline:** Config-driven training, evaluation, export, and demo — swap models or prompts without touching infra.
* **Privacy-first:** Explicit consent UI, opt-in telemetry, anonymized and encrypted exports, and local-first inference patterns.

---

## Project Highlights

* Designed for **real-world deployments** where cheap/low-power compute matters.
* Production practices baked in: rate-limiting, CORS, robust error handling, streaming backpressure handling for websockets.
* Developer-first demos (Gradio + local dev server) to accelerate onboarding and bug reproduction.
* Clearly separated training/inference/eval/export code paths so engineering teams can safely iterate.

---

## Architecture (high-level)

Vizionary is intentionally modular. At a high level:

* **Frontend** — Next.js app (React) that connects via WebSocket to the backend for live streaming descriptions and shows overlay visualizations. UI built with Shadcn UI + Tailwind.
* **Backend** — FastAPI service that accepts image/video frames or media uploads, orchestrates inference calls, and streams text + overlay results over WebSocket. Responsible for rate-limiting, authentication (optional), and export hooks.
* **Training** — PyTorch-based training pipeline with config-driven hyperparameters, supports both train-from-scratch and fine-tune flows. Evaluation and Grad-CAM visualization utilities included.
* **Export** — Scripts to export to TorchScript and ONNX, plus tuning helpers for dynamic/static quantization.

> The README intentionally omits internal model architecture details; the repository keeps configuration and safe model cards for reproducibility and sharing.

---

## Quickstart

> These commands assume you cloned the repo at the root `Vizionary/`.

### Prerequisites

* Node.js >= 18, npm/yarn
* Python 3.10+
* `git` and `git-lfs` (if pushing model artifacts)
* Optional: GPU + CUDA for training (Colab recommended)

### Clone

```bash
git clone https://github.com/Genious07/Vizionary.git
cd Vizionary
```

### Frontend dev (Next.js)

```bash
cd frontend
npm install
# run in dev mode (default http://localhost:9002)
npm run dev
```

Open: `http://localhost:9002`

### Backend & Demo (local)

Create a Python environment and install dependencies:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # macOS / Linux
# .venv\Scripts\activate  on Windows
pip install -r requirements.txt
```

Run the API server (FastAPI):

```bash
# default: http://127.0.0.1:8000
uvicorn src.main:app --reload --port 8000
```

Run the Gradio demo (optional):

```bash
python src/demo.py --model checkpoints/model_traced.pt
# or python src/demo.py --model checkpoints/model.onnx
```

> The frontend expects the websocket URL (e.g. `ws://localhost:8000/ws/describe`) to be configured in `.env.local`.

---

## Train / Evaluate / Export (Colab-ready)

This repo is Colab-first for training. The recommended workflow is:

1. **Choose runtime** → GPU (for training) or CPU (for inference/demo).
2. **Install deps** (in a Colab cell):

```python
!pip install -q torch torchvision timm pytorch-grad-cam gradio huggingface-hub matplotlib tqdm
```

3. **Prepare dataset** — ImageFolder layout (`data/train/<class>/*`, `data/val/<class>/*`) or mount Google Drive.

4. **Train**

```bash
python src/train.py --config configs/train.yaml
```

`configs/train.yaml` includes: dataset path, lr, optimizer, epochs, batch size, seed, and flags to toggle pretrained weights.

5. **Evaluate & Visualize**

```bash
python src/evaluate.py --checkpoint checkpoints/best_model.pth --image example.jpg --visualize
```

This prints predicted label + confidence and saves a Grad-CAM overlay.

6. **Export for CPU**

```bash
python src/export.py --checkpoint checkpoints/best_model.pth --format torchscript --out checkpoints/model_traced.pt
# or ONNX
python src/export.py --checkpoint checkpoints/best_model.pth --format onnx --out checkpoints/model.onnx
```

7. **Optional quantization**

* Dynamic quantization for CPU (PyTorch): `quantize_dynamic` in export helpers.
* ONNX INT8 requires a calibration set (scripts available under `src/utils/quantize.py`).

---

## Deployment

### Hugging Face (model + demo)

1. `huggingface-cli login`
2. Create a model repo and a Space for the demo.
3. Use `python src/push_to_hf.py --model-path checkpoints/model_traced.pt --repo your-username/vizionary-model`.

> This repo contains helper scripts to automate uploads and to create a simple model card. Keep private keys and secrets out of version control.

### Docker (recommended for repeatable infra)

Add a `.env` file with the values below and build images for frontend/backend.

```env
# .env.example
FRONTEND_PORT=9002
BACKEND_PORT=8000
MODEL_PATH=/srv/models/model_traced.pt
```

Example Docker commands:

```bash
# build backend image
docker build -f docker/backend.Dockerfile -t vizionary-backend:latest .
# run
docker run -p 8000:8000 -e MODEL_PATH=/models/model_traced.pt -v /local/models:/models vizionary-backend:latest
```

Cloud providers: deploy backend as a small VM (2vCPU, 8–16GB RAM) or use serverless containers with persistent disk for model files.

---

## API & WebSocket contract

**HTTP**

* `POST /api/upload` — upload image/video → returns media ID
* `GET /api/status/{media_id}` — returns processing status and last result

**WebSocket** (`/ws/describe`)

* Client sends `{
  "media_id": "...",
  "frame_rate": 1,
  "lang": "en"
  }`
* Server streams messages of shape `{
  "timestamp": "...",
  "text": "Generated sentence...",
  "confidence": 0.87,
  "overlay_url": "https://.../overlays/123.png"
  }`

Backpressure & reconnection: the client should reconnect with exponential backoff and provide last-seen timestamp to resume streaming from the last frame.

---

## Performance & Optimization Tips

* **Reduce input resolution** (e.g., 160×160) for lower latency when high accuracy is not required.
* **Batch offline workloads** and use single-image optimized paths for webcam inference.
* **Quantize exports** (dynamic for PyTorch, INT8 for ONNX with calibration) for CPU speedups.
* **Use ONNX Runtime** with thread affinity/OMP settings tuned for the host CPU.
* **Cache outputs** for repeated/slow-changing frames to avoid redundant inferences.

Benchmarks (rough targets):

* Cold start time-to-first-text on 2vCPU: **\~1–3s** depending on export format and model size.
* Streaming cadence: text updates every **10–12s** by design (configurable).

---

## Security, Privacy & Responsible Use

* **User consent:** Frontend includes a consent modal for live camera access and data retention choices.
* **Local-first inference:** Prefer local or on-prem inference to avoid sending raw frames to third-party services.
* **Anonymization & opt-out:** All telemetry is opt-in and anonymized; exports can be encrypted using a user-provided key.
* **Explainability limits:** Grad-CAM overlays are developer debugging aids, not definitive proofs of correctness — include human-in-the-loop for critical decisions.

Responsible use disclaimer: Do not use Vizionary for safety-critical decisions without rigorous testing and human oversight.

---

## Project Layout(You can use)

```
vizionary/
├── frontend/                 # Next.js app (React + Shadcn UI)
├── backend/                  # FastAPI app, inference orchestration
│   ├── src/
│   │   ├── main.py
│   │   ├── infer.py
│   │   ├── websocket.py
│   │   └── utils.py
├── src/ (training portion)
│   ├── train.py
│   ├── evaluate.py
│   ├── export.py
│   └── datasets.py
├── configs/
├── checkpoints/
├── demos/                    # Gradio demo & notebooks
└── docs/
    └── model_card.md
```

---

## Troubleshooting & FAQ

**Q: WebSocket disconnects frequently.**

* A: Implement exponential backoff and reconnect with last-seen timestamp. Ensure server `uvicorn` timeout and proxy (nginx) timeouts are configured.

**Q: Export produces slow CPU inference.**

* A: Try dynamic quantization, lower resolution, or ONNX Runtime with INT8 quantization.

**Q: Grad-CAM fails/errors.**

* A: Ensure the selected convolutional block exists; use the auto-selection utility (`src/utils/gradcam_helper.py`).

**Q: Accuracy is low when training from scratch.**

* A: Use more data or switch to fine-tune mode with a pretrained starting point (toggle in `configs/train.yaml`).

---

## Contributing & Code Review Guidelines

* Fork → branch named `feat/*` or `fix/*` → include tests and examples → open a PR.
* Keep changes small and focused. Add or update `docs/` and `configs/` for any user-facing behavior changes.
* Include reproducible steps for behavioral changes and performance benchmarks when modifying inference/export code.
* Avoid committing model weights or secrets. Use Git LFS for large files if necessary.

---

## License & Acknowledgements

Vizionary is released under the **MIT License**. See `LICENSE` for details.

Thanks to the open-source ecosystem: PyTorch, Timm, Grad-CAM tooling, Hugging Face, Gradio, Next.js, Tailwind, and the many contributors across these projects.

---

*Made  by Satwik Singh(#7) — privacy-first, production-minded computer vision.*
