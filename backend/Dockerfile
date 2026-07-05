FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
RUN groupadd -r mergemind && useradd -r -g mergemind mergemind
COPY --from=builder /root/.local /home/mergemind/.local
COPY . .
ENV PATH=/home/mergemind/.local/bin:$PATH
RUN chown -R mergemind:mergemind /app
USER mergemind
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]