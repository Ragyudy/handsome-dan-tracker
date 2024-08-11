import os
import torch
import torchvision
from torchvision import models
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
from torchvision.transforms import functional as F
from torchvision import transforms as T
from PIL import Image
import xml.etree.ElementTree as ET
from sklearn.metrics import precision_score, recall_score, f1_score
import time
from tqdm import tqdm
from torch.cuda.amp import GradScaler, autocast
import torchvision.transforms as transforms
import torch.nn as nn


def predict(image_path, model, device):
   # evaluation mode
   model.eval()


   # load and preprocess the image
   image = Image.open(image_path).convert("RGB")


   transform = transforms.Compose([
       transforms.ToTensor(),
   ])
   image = transform(image).unsqueeze(0)


   # move image to device
   image = image.to(device)


   # don't influence gradients
   with torch.no_grad():
       prediction = model(image)


   # make predictions, confidence level > 0.3
   preds = prediction[0]["labels"].cpu().numpy()
   scores = prediction[0]["scores"].cpu().numpy()
   # print("PREDICTIONS")
   # print(preds)
   # print("SCORES")
   # print(scores)
   if len(preds) > 0 and any(pred == 1 and score > 0.5 for pred, score in zip(preds, scores)):
       return 1 # this is handsome dan
   else:
       return 0 # this is not handsome dan


# # start with pretrained model
# model = models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
# in_features = model.roi_heads.box_predictor.cls_score.in_features
# model.roi_heads.box_predictor = FastRCNNPredictor(in_features, 3)


# # load our pretrained weights in
# model_path = 'handsome_dan_detector_model.pth'
# model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))


# device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
# model.to(device)


# # predict based on image URL
# predictions = predict('/path/to/image.jpg', model, device)


# # 0 = not handsome dan, 1 = handsome dan
# print("Predictions: ")
# print(predictions)