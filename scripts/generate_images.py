import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv("/app/backend/.env")

from emergentintegrations.llm.chat import LlmChat, UserMessage

OUT = Path("/app/frontend/public/images")
OUT.mkdir(parents=True, exist_ok=True)

IMAGES = {
    "hero-farm.png": "Cinematic wide commercial photograph of a thriving South Indian coconut farm at sunrise, long rows of tall healthy palms, mature coconut clusters, subtle farm workers inspecting the crop in the middle distance, deep natural greens and warm sunlight, generous darker negative space for white headline text, premium agricultural export brand aesthetic, no factory, no warehouse, no text, photorealistic, high resolution",
    "semi-husked.png": "Macro product photography of uniformly brown, clean, neatly shaved semi-husked coconuts with fibrous tuft tops arranged in precise rows inside an automated processing facility, dark deep-green backdrop, single dramatic spotlight from above, ultra sharp texture detail, premium export-grade produce, photorealistic",
    "tender.png": "Bright clean commercial photography of fresh bright green tender coconuts, polished and shiny, moving on a hygienic stainless steel sorting conveyor belt in a brightly lit modern food facility, crisp reflections, export quality produce photography, photorealistic",
    "copra-export.png": "Premium commercial product photograph of unmistakably dry coconut copra cups removed from most of the shell, thick ivory dried kernel, curled cup shapes, dry matte wrinkled surfaces, pale toasted brown skin, clearly dehydrated and not fresh or glossy, arranged on a warm off-white seamless background, accurate export commodity photography, no props, no text, photorealistic",
    "facility.png": "Wide editorial shot of a modern hygienic coconut processing facility in India, workers in clean uniforms and hairnets grading coconuts on stainless steel tables, bright industrial lighting, spotless environment, documentary commercial photography, photorealistic",
    "sorting.png": "Close-up commercial photograph of gloved hands quality-checking bright green tender coconuts on a conveyor line in a hygienic food-grade facility, bright even lighting, shallow depth of field, photorealistic",
    "packing.png": "Commercial photograph of semi-husked coconuts packed in orange mesh bags and labelled export cartons stacked on wooden pallets inside a clean warehouse, pallet wrapping in progress, editorial logistics photography, photorealistic",
    "farm.png": "Lush green coconut palm plantation in South India at golden hour, tall palms heavy with coconut clusters, warm sunlight filtering through leaves, rich green and amber tones, cinematic landscape photography, photorealistic",
}


async def gen(name: str, prompt: str) -> bool:
    try:
        chat = LlmChat(
            api_key=os.environ["EMERGENT_LLM_KEY"],
            session_id=f"transocean-{name}",
            system_message="You are a professional commercial photographer generating photorealistic images.",
        )
        chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
        _text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
        if images:
            (OUT / name).write_bytes(base64.b64decode(images[0]["data"]))
            print(f"OK {name}", flush=True)
            return True
        print(f"NOIMAGE {name}", flush=True)
    except Exception as e:
        print(f"FAIL {name}: {str(e)[:200]}", flush=True)
    return False


async def main():
    results = []
    for name, prompt in IMAGES.items():
        results.append(await gen(name, prompt))
    print(f"DONE {sum(results)}/{len(results)}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
