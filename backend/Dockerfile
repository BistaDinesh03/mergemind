FROM python:3.11-alpine AS builder

WORKDIR /app

# Install build dependencies for Python packages
RUN apk add --no-cache gcc musl-dev libffi-dev

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/build -r requirements.txt

FROM python:3.11-alpine

# Create non-root user
RUN addgroup -S mergemind && adduser -S mergemind -G mergemind

WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache libffi

# Copy installed packages
COPY --from=builder /build /usr/local

# Copy application code
COPY --chown=mergemind:mergemind . .

# Create data directory
RUN mkdir -p /app/data && chown -R mergemind:mergemind /app/data

# Clean up
RUN rm -rf /root/.cache /var/cache/apk/* /tmp/* /var/tmp/* && \
    find /usr/local -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true && \
    find /usr/local -type f -name "*.pyc" -delete 2>/dev/null || true

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DATABASE_URL=sqlite:////app/data/mergemind.db

USER mergemind

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=5 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health/live')" || exit 1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]