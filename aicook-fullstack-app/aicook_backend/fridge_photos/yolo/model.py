from ultralytics import YOLO
import os

model_path = os.path.join(os.path.dirname(__file__), "yolov8n.pt")
model = YOLO(model_path)
