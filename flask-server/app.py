import logging
from logging.handlers import RotatingFileHandler
import os


from flask import Flask, request, jsonify
from predict import predict
import torch
import os
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


app = Flask(__name__)
app.logger.info("hello")
# start with pretrained model
model = models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
in_features = model.roi_heads.box_predictor.cls_score.in_features
model.roi_heads.box_predictor = FastRCNNPredictor(in_features, 3)


# load our pretrained weights in
model_path = 'handsome_dan_detector_model.pth'
model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))


device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
model.to(device)


@app.route('/predict', methods=['POST'])
def predict_image():
   # app.logger.info("Received a prediction request")
   # app.logger.info(f"Request files: {request.files}")
  
   if 'file' not in request.files:
       # app.logger.error("No file part in the request")
       return jsonify({'error': 'No file part'})
  
   file = request.files['file']
   if file.filename == '':
       # app.logger.error("No selected file")
       return jsonify({'error': 'No selected file'})
  
   if file:
       # app.logger.info(f"Received file: {file.filename}")
       # Save the file temporarily
       temp_path = '/tmp/temp_image.jpg'
       file.save(temp_path)
      
       # Make prediction
       result = predict(temp_path, model, device)
       # app.logger.info(f"Prediction result: {result}")
      
       return jsonify({'result': int(result)})


if __name__ == '__main__':
   # Set up logging to file
   # log_dir = 'logs'
   # if not os.path.exists(log_dir):
   #     os.mkdir(log_dir)
   # file_handler = RotatingFileHandler(os.path.join(log_dir, 'app.log'), maxBytes=10240, backupCount=10)
   # file_handler.setFormatter(logging.Formatter(
   #     '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
   # ))
   # file_handler.setLevel(logging.INFO)
   # app.logger.addHandler(file_handler)


   # # Set up logging to console
   # console_handler = logging.StreamHandler()
   # console_handler.setLevel(logging.INFO)
   # app.logger.addHandler(console_handler)


   # app.logger.setLevel(logging.INFO)
   # app.logger.info('Flask app startup')


   app.run(host='0.0.0.0', port=5001, debug=True)