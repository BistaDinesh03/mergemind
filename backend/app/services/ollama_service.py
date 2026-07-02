""""
Ollama AI Service
Local LLM integration for MergeMind intelligence features.
""""
import httpx
import json
from typing import Dict, List, Optional, AsyncGenerator
from ..config import settings

class OllamaService:
    """Service for interacting with Ollama LLM."""
    
    def __init__(self, base_url: str = None, model: str = None):
        self.base_url = base_url or settings.ollama_host
        self.model = model or settings.ollama_model
        self.client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=120.0,  # Longer timeout for LLM inference
        )
    
    async def generate(
        self,
        prompt: str,
        system_prompt: str = None,
        temperature: float = 0.7,
        max_tokens: int = 500,
    ) -> Dict:
        """"
        Generate a response from Ollama.
        
        Args:
            prompt: User prompt
            system_prompt: System context prompt
            temperature: Creativity level (0-1)
            max_tokens: Maximum response length
            
        Returns:
            Dictionary with generated text and metadata
        """"
        messages = []
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = await self.client.post(
                "/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens,
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                "text": data.get("message", {}).get("content", ""),
                "model": self.model,
                "total_duration": data.get("total_duration", 0),
                "prompt_eval_count": data.get("prompt_eval_count", 0),
            }
        except Exception as e:
            print(f"Ollama generation error: {e}")
            return {
                "text": self._get_fallback_response(prompt),
                "model": "fallback",
                "error": str(e),
            }
    
    async def generate_stream(
        self,
        prompt: str,
        system_prompt: str = None,
    ) -> AsyncGenerator[str, None]:
        """Stream generated tokens."""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        try:
            async with self.client.stream(
                "POST",
                "/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": True,
                },
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        try:
                            data = json.loads(line)
                            content = data.get("message", {}).get("content", "")
                            if content:
                                yield content
                        except json.JSONDecodeError:
                            continue
        except Exception as e:
            yield f"[Error: {str(e)}]"
    
    async def list_models(self) -> List[Dict]:
        """List available Ollama models."""
        try:
            response = await self.client.get("/api/tags")
            response.raise_for_status()
            return response.json().get("models", [])
        except Exception as e:
            print(f"Error listing models: {e}")
            return []
    
    async def pull_model(self, model_name: str) -> Dict:
        """Pull a model from Ollama registry."""
        try:
            response = await self.client.post(
                "/api/pull",
                json={"name": model_name},
                timeout=300.0,
            )
            response.raise_for_status()
            return {"status": "success", "model": model_name}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def _get_fallback_response(self, prompt: str) -> str:
        """Provide fallback responses when Ollama is unavailable."""
        if "analyze" in prompt.lower() or "issue" in prompt.lower():
            return json.dumps({
                "analysis": "This issue appears to be a good opportunity based on available metrics.",
                "opportunity_score": 75,
                "recommendation": "Consider reviewing the CONTRIBUTING.md before starting.",
                "estimated_effort": "2-3 hours",
                "key_considerations": [
                    "Read existing comments for context",
                    "Check if tests need updating",
                    "Keep changes focused and minimal"
                ]
            })
        return "I'm currently running in fallback mode. Connect Ollama for full AI analysis."

    async def close(self):
        """Close the HTTP client."""
        await self.client.aclose()

# Factory function
def get_ollama_service() -> OllamaService:
    """Create an OllamaService instance."""
    return OllamaService()
