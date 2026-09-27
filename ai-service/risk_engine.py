"""
Disease Risk Mapping & Transparent Screening Engine for BEEPROOF
================================================================
This module encapsulates business and beekeeping application logic cleanly
separated from machine learning inference.

Key Principles:
1. Conservative Language: Uses "Possible indicator", "Visual screening",
   and explicitly avoids claiming medical or laboratory certainty.
2. Transparent Thresholding: Configurable rule-based heuristic scoring.
3. Actionable Beekeeper Guidance: Practical next steps for hive inspections.
"""

from typing import Dict, List, Any, Optional

# Medical and scientific disclaimer
DISCLAIMER_TEXT = (
    "AI-assisted visual screening indicator only. Detections do NOT constitute "
    "a confirmed veterinary diagnosis or certified laboratory test. "
    "Expert inspection and field/laboratory testing (e.g. microscopic examination, "
    "ropiness test, spore analysis) are strongly recommended before initiating treatment."
)

CLASS_METADATA = {
    "american-foulbrood": {
        "display_name": "American Foulbrood (AFB)",
        "indicator": "Possible American Foulbrood visual indicator",
        "category": "Severe Bacterial Brood Disease",
        "is_pathology": True,
        "urgency": "CRITICAL",
        "recommendation": (
            "Isolate the hive immediately. Perform a ropiness test on diseased larvae. "
            "Notify local apiary inspectors and do not interchange equipment to prevent spore spread."
        ),
    },
    "bee-larvae": {
        "display_name": "Healthy Bee Larvae",
        "indicator": "Normal brood larvae presence",
        "category": "Healthy Brood",
        "is_pathology": False,
        "urgency": "NONE",
        "recommendation": "Monitor healthy glistening white pearlescent brood development.",
    },
    "chalk-brood": {
        "display_name": "Chalkbrood",
        "indicator": "Possible Chalkbrood visual indicator",
        "category": "Fungal Brood Disease",
        "is_pathology": True,
        "urgency": "MODERATE",
        "recommendation": (
            "Improve hive ventilation, tilt hive slightly forward to prevent moisture pooling, "
            "and consider requeening if infection persists across brood cycles."
        ),
    },
    "empty-cells": {
        "display_name": "Empty Brood Cells",
        "indicator": "Empty comb cells",
        "category": "Comb Architecture",
        "is_pathology": False,
        "urgency": "NONE",
        "recommendation": "Track laying pattern regularity and queen egg-laying capacity.",
    },
    "nosema": {
        "display_name": "Nosema",
        "indicator": "Possible Nosema visual indicator",
        "category": "Microsporidian Gut Pathology",
        "is_pathology": True,
        "urgency": "MODERATE",
        "recommendation": (
            "Inspect hive entrance and top bars for dysentery/fecal streaking. "
            "Send gut sample for microscopic spore count analysis if sluggishness or crawling bees persist."
        ),
    },
    "pollen": {
        "display_name": "Pollen Store",
        "indicator": "Pollen reserve cells",
        "category": "Hive Nutrition",
        "is_pathology": False,
        "urgency": "NONE",
        "recommendation": "Healthy colony protein resource storage.",
    },
    "small-hive-beetle": {
        "display_name": "Small Hive Beetle",
        "indicator": "Possible Small Hive Beetle pest indicator",
        "category": "Parasitic Hive Pest",
        "is_pathology": True,
        "urgency": "HIGH",
        "recommendation": (
            "Deploy beetle traps with mineral oil or apple cider vinegar. "
            "Maintain strong colony population and inspect bottom board."
        ),
    },
    "varroa-mites": {
        "display_name": "Varroa Destructor Mites",
        "indicator": "Possible Varroa mite visual indicator",
        "category": "Parasitic Mite Pest",
        "is_pathology": True,
        "urgency": "HIGH",
        "recommendation": (
            "Perform an immediate standard alcohol wash or powdered sugar roll to calculate mite infestation percentage. "
            "Apply Integrated Pest Management (IPM) treatment if above economic threshold (>= 2-3% infestation)."
        ),
    },
    "wax-moth-larva": {
        "display_name": "Wax Moth Larva",
        "indicator": "Possible Wax Moth larva indicator",
        "category": "Destructive Comb Pest",
        "is_pathology": True,
        "urgency": "HIGH",
        "recommendation": (
            "Physically remove caterpillars. Freeze heavily infested frames at -15°C for 48 hours to kill eggs/larvae. "
            "Reduce hive entrance size to assist guard bees."
        ),
    },
    "wax-moth-larva-presence": {
        "display_name": "Wax Moth Webbing/Damage Sign",
        "indicator": "Possible Wax Moth silken tunneling or comb debris",
        "category": "Pest Damage Sign",
        "is_pathology": True,
        "urgency": "HIGH",
        "recommendation": (
            "Inspect comb midribs for silk tunnels and frass. "
            "Consolidate weak colonies to prevent wax moth proliferation."
        ),
    },
}


class BeeRiskEngine:
    """
    Evaluates raw YOLO object detections and computes transparent,
    conservative risk levels and actionable beekeeping summaries.
    """

    def __init__(self, low_threshold: float = 0.50, high_threshold: float = 0.75):
        self.low_threshold = low_threshold
        self.high_threshold = high_threshold

    def calculate_risk_level(self, class_name: str, confidence: float) -> str:
        """
        Maps a detection to a transparent heuristic risk level.
        Non-pathological classes always yield LOW risk.
        """
        meta = CLASS_METADATA.get(class_name, {})
        is_pathology = meta.get("is_pathology", True)

        if not is_pathology:
            return "LOW"

        if confidence < self.low_threshold:
            return "LOW"
        elif self.low_threshold <= confidence < self.high_threshold:
            return "MEDIUM"
        else:
            return "HIGH"

    def process_detections(
        self,
        raw_detections: List[Dict[str, Any]],
        image_name: str = "image.jpg",
        image_width: int = 416,
        image_height: int = 416,
    ) -> Dict[str, Any]:
        """
        Processes a list of raw detections into a rich, structured output with
        transparent risk mappings and hive-level summaries.
        """
        processed_detections = []
        class_summary_map: Dict[str, Dict[str, Any]] = {}

        # Initialize summary for all 10 known classes
        for cls_name, meta in CLASS_METADATA.items():
            class_summary_map[cls_name] = {
                "class_name": cls_name,
                "display_name": meta["display_name"],
                "category": meta["category"],
                "is_pathology": meta["is_pathology"],
                "detected": False,
                "count": 0,
                "max_confidence": 0.0,
                "risk": "LOW",
                "recommendation": meta["recommendation"],
            }

        highest_pathology_risk = "LOW"
        risk_priority = {"LOW": 1, "MEDIUM": 2, "HIGH": 3}

        for det in raw_detections:
            cls_name = det.get("class", "")
            conf = float(det.get("confidence", 0.0))
            bbox = det.get("bbox", {})

            meta = CLASS_METADATA.get(
                cls_name,
                {
                    "display_name": cls_name,
                    "indicator": f"Possible {cls_name} indicator",
                    "category": "Unclassified",
                    "is_pathology": True,
                    "urgency": "LOW",
                    "recommendation": "Perform manual visual hive inspection.",
                },
            )

            risk_level = self.calculate_risk_level(cls_name, conf)

            # Update class summary
            if cls_name in class_summary_map:
                summary_item = class_summary_map[cls_name]
                summary_item["detected"] = True
                summary_item["count"] += 1
                if conf > summary_item["max_confidence"]:
                    summary_item["max_confidence"] = round(conf, 4)
                    summary_item["risk"] = risk_level

            # Update overall highest pathology risk
            if meta.get("is_pathology", True):
                if risk_priority.get(risk_level, 1) > risk_priority.get(highest_pathology_risk, 1):
                    highest_pathology_risk = risk_level

            # Format detection item
            processed_detections.append({
                "class": cls_name,
                "display_name": meta["display_name"],
                "indicator": meta["indicator"],
                "category": meta["category"],
                "is_pathology": meta.get("is_pathology", True),
                "confidence": round(conf, 4),
                "risk": risk_level,
                "urgency": meta.get("urgency", "LOW"),
                "bbox": bbox,
                "recommendation": meta["recommendation"],
            })

        # Urgent actions aggregation
        urgent_actions = []
        for cls_name, summary in class_summary_map.items():
            if summary["detected"] and summary["is_pathology"] and summary["risk"] in ["MEDIUM", "HIGH"]:
                urgent_actions.append({
                    "condition": summary["display_name"],
                    "risk": summary["risk"],
                    "confidence": summary["max_confidence"],
                    "action": summary["recommendation"],
                })

        return {
            "image": image_name,
            "image_dimensions": {"width": image_width, "height": image_height},
            "total_detections": len(processed_detections),
            "overall_hive_health_risk": highest_pathology_risk,
            "urgent_actions": urgent_actions,
            "detections": processed_detections,
            "summary": class_summary_map,
            "disclaimer": DISCLAIMER_TEXT,
        }
