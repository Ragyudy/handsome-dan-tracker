import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
} from 'react-native-vision-camera';

const App = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back', {
    physicalDevices: ['ultra-wide-angle-camera'],
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<number | null>(null);

  const camera = useRef<Camera>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingDots(prev => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const capturePhoto = async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      setCapturedPhoto(photo.path);
      setIsCameraActive(false);
    }
  };

  const resetCamera = () => {
    setCapturedPhoto(null);
    setIsCameraActive(true);
    setPredictionResult(null);
    setIsLoading(false);
    setLoadingDots('');
  };

  if (!hasPermission) {
    return <ActivityIndicator />;
  }

  if (!device) {
    return <Text>Camera device not found</Text>;
  }

  const renderDefaultView = () => (
    <View style={styles.defaultContainer}>
      <Text style={styles.title}>Welcome to HandsomeDanTracker</Text>
      <Text style={styles.subtitle}>
        Start tracking Yale's handsome Dans here!
      </Text>
      <Button title="Start Camera" onPress={() => setIsCameraActive(true)} />
    </View>
  );

  const renderCameraView = () => (
    <View style={styles.fullScreenCamera}>
      <StatusBar hidden />
      <Camera
        ref={camera}
        photo={true}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
      />
      <View style={styles.buttonContainer}>
        <Button title="Capture Photo" onPress={capturePhoto} color="white" />
      </View>
    </View>
  );

  const handleProceedWithPhoto = async () => {
    try {
      setPredictionResult(null); // Reset previous result
      setIsLoading(true); // Start loading
      const result = await sendImageForPrediction(capturedPhoto!);
      setPredictionResult(result);
    } catch (error) {
      console.error('Error in prediction:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const renderCapturedPhotoView = () => {
    let messageText = '';
    if (isLoading) {
      messageText = `Loading${loadingDots}`;
    } else if (predictionResult !== null) {
      if (predictionResult === 1) {
        messageText = 'This is Handsome Dan!';
      } else {
        messageText = 'This is not Handsome Dan.';
      }
    }
    return (
      <View style={styles.capturedPhotoContainer}>
        <Image
          source={{uri: `file://${capturedPhoto}`}}
          style={styles.capturedPhoto}
        />
        <Button title="Proceed with Photo" onPress={handleProceedWithPhoto} />
        <Button title="Take Another Photo" onPress={resetCamera} />
        {messageText !== '' && (
          <Text style={styles.predictionText}>{messageText}</Text>
        )}
      </View>
    );
  };

  async function fetchFileAsBlob(uri: string): Promise<Blob> {
    const response = await fetch(uri);
    return await response.blob();
  }

  const sendImageForPrediction = async (imagePath: string) => {
    try {
      const formData = new FormData();
      // Extract the file name from the path
      const fileName = imagePath.split('/').pop() || 'image.jpg';
      formData.append('file', {
        uri: `file://${imagePath}`,
        type: 'image/jpeg', // or the appropriate MIME type
        name: fileName,
      } as any);
      // console.log('FormData created:', formData);
      const response = await fetch('http://192.168.1.29:5001/predict', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log('Response status:', response.status);

      const result = await response.json();
      // console.log('Result:', result);
      return result.result;
    } catch (error) {
      console.error('Error sending image for prediction:', error);
      throw error;
    }
  };

  return (
    <>
      {!isCameraActive && !capturedPhoto && (
        <SafeAreaView style={styles.container}>
          {renderDefaultView()}
        </SafeAreaView>
      )}
      {isCameraActive && renderCameraView()}
      {capturedPhoto && (
        <SafeAreaView style={styles.container}>
          {renderCapturedPhotoView()}
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00356b',
  },
  defaultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: 'white',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  capturedPhotoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  capturedPhoto: {
    width: '100%',
    height: '80%',
    marginBottom: 20,
  },
  fullScreenCamera: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  predictionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
  },
});

export default App;
