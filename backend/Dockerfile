FROM python:3.11-alpine AS builder

WORKDIR /app
RUN apk add --no-cache gcc musl-dev libffi-dev
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/build -r requirements.txt

FROM python:3.11-alpine

RUN addgroup -S mergemind && adduser -S mergemind -G mergemind

WORKDIR /app

RUN apk add --no-cache libffi

COPY --from=builder /build /usr/local
COPY --chown=mergemind:mergemind . .

RUN mkdir -p /app/data && chown -R mergemind:mergemind /app/data

RUN rm -rf /root/.cache /var/cache/apk/* /tmp/* /var/tmp/* && \
    find /usr/local -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local -type f -name "*.pyc" -delete 2>/dev/null || true

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DATABASE_URL=sqlite:////app/data/mergemind.db

USER mergemind

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=5 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:${PORT:-8000}/health/live')" || exit 1

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]