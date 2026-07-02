#!/bin/bash
# Ollama Model Setup Script for MergeMind
# Run this to pull required models

echo "Pulling MergeMind AI models..."

# Primary model for analysis
echo "Pulling llama3:8b..."
ollama pull llama3:8b

# Secondary model for varied responses
echo "Pulling qwen2.5:7b..."
ollama pull qwen2.5:7b

echo "Models pulled successfully!"
echo ""
echo "Available models:"
ollama list
