# Multi-stage build for production
FROM python:3.11-slim AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim

WORKDIR /app

# Create non-root user
RUN useradd -m -u 1000 mergemind && chown -R mergemind:mergemind /app

COPY --from=builder /root/.local /home/mergemind/.local
COPY . .

# Ensure scripts in .local are usable
ENV PATH=/home/mergemind/.local/bin:$PATH

USER mergemind

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]