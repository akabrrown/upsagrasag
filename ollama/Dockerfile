FROM ollama/ollama:latest

# Pull the default model (llama2) on container start
ENV OLLAMA_MODEL=llama2

# Expose Ollama API port
EXPOSE 11434

# Run Ollama, pulling the model if not present, then serve
CMD ["sh", "-c", "ollama pull $OLLAMA_MODEL && ollama serve"]
