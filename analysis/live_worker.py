import os
import time
import analyze

LIVE_MINUTES = max(5, int(os.environ.get("LIVE_MINUTES", "240")))
POLL_SECONDS = max(5, int(os.environ.get("POLL_SECONDS", "15")))
BATCH_SIZE = max(1, int(os.environ.get("LIVE_BATCH_SIZE", "4")))

def main():
    print(
        f"Starting CVS LIVE worker: model={analyze.MODEL_SIZE}, "
        f"window={LIVE_MINUTES}min, poll={POLL_SECONDS}s, batch={BATCH_SIZE}",
        flush=True,
    )

    model = analyze.WhisperModel(
        analyze.MODEL_SIZE,
        device="cpu",
        compute_type="int8",
        cpu_threads=1,
        num_workers=1,
    )

    deadline = time.time() + LIVE_MINUTES * 60
    total_processed = 0

    while time.time() < deadline:
        processed_now = 0

        while processed_now < BATCH_SIZE and time.time() < deadline:
            nxt = analyze.bridge("next")
            job = nxt.get("job")

            if not job:
                break

            rid = job["leitura_id"]
            print(f"Processing queued reading {rid}", flush=True)

            try:
                result = analyze.process_job(model, job)
                analyze.bridge("result", result=result)
                print(f"Completed {rid}", flush=True)
            except Exception as exc:
                try:
                    analyze.bridge("error", leitura_id=rid, error=str(exc)[:2000])
                finally:
                    print(f"Failed {rid}: {exc}", flush=True)

            processed_now += 1
            total_processed += 1

        if processed_now == 0:
            time.sleep(POLL_SECONDS)
        else:
            time.sleep(1)

    print(f"LIVE window finished. Total processed={total_processed}", flush=True)

if __name__ == "__main__":
    main()
