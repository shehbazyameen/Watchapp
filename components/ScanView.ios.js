import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import {Colors, Constants, Values} from '../../constants';
import {useCameraDevices, useFrameProcessor} from 'react-native-vision-camera';
import {Camera} from 'react-native-vision-camera';
import {
  useScanBarcodes,
  BarcodeFormat,
  scanBarcodes,
} from 'vision-camera-code-scanner';


import {runOnJS} from 'react-native-reanimated';

const REGION_HEIGHT = 120;
const REGION_WIDTH = Values.deviceWidth - 80;
const REGION_POSITION_TOP = (Values.deviceHeight * 0.6 - 120) / 2;
const REGION_POSITION_LEFT = 40;
const WINDOW_WIDTH = Values.deviceWidth;
const WINDOW_HEIGHT = Values.deviceHeight;
const ScanView = props => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;
  const [isPartialDetect, setIsPartialDetect] = useState(props.isPartialDetect);
  const isFullCamera = props.renderLastScanResultView ? false : true;
  const [barcodes, setBarcodes] = useState([]);
  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS], {
      checkInverted: true,
    });
    console.log('frame', frame);

    const xRatio = frame.width / WINDOW_WIDTH;
    const yRatio = frame.height / WINDOW_HEIGHT;

    const ratio = WINDOW_WIDTH / frame.width;

    const barcodes = [];
    if (detectedBarcodes.length > 0) {
      detectedBarcodes.forEach(barcode => {
        const cornerPoints = barcode.cornerPoints;

        const resultPoints = cornerPoints.map(corner => {
          return {
            x: parseFloat(corner.x) * ratio,
            y: parseFloat(corner.y) * ratio,
          };
        });

        barcodes.push({
          ...barcode,
          cornerPoints: resultPoints,
        });
      });
    }
    runOnJS(setBarcodes)(barcodes);
  }, []);
  React.useEffect(() => {
    onRequestPermission();
  }, []);
  const onRequestPermission = async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'authorized');
  };

  React.useEffect(() => {
    if (barcodes) {
      let isChecked = false;
      barcodes.forEach(barcode => {
        isChecked = checkAndCapture(barcode);
      });
      if (isChecked) {
        Vibration.vibrate();
      }
    }
  }, [barcodes]);
  const checkAndCapture = barcode => {
    let isChecked = false;
    if (validateBarcode(barcode)) {
      isChecked = true;
      onButtonAction({
        type: Constants.actionType.ACTION_CAPTURE,
        value: barcode.rawValue,
      });
    }
    return isChecked;
  };
  const validateBarcode = barcode => {
    const cornerPoints = getPointsInView(barcode.cornerPoints);
    if (!isPartialDetect) {
      return true;
    }
    const topLeft = {x: REGION_POSITION_LEFT, y: REGION_POSITION_TOP};
    const bottomRight = {
      x: Values.deviceWidth - REGION_POSITION_LEFT,
      y: REGION_POSITION_TOP + REGION_HEIGHT,
    };
    let isValid = true;
    cornerPoints.forEach(point => {
      const isPointInRegion =
        point.x >= topLeft.x &&
        point.y >= topLeft.y &&
        point.x <= bottomRight.x &&
        point.y <= bottomRight.y;
      if (!isPointInRegion) {
        isValid = false;
      }
    });
    return isValid;
  };
  const getPointsInView = cornerPoints => {
    return cornerPoints.map(point => {
      return {
        x: point.x,
        y: point.y,
      };
    });
  };
  const renderBoundingBoxes = () => {
    if (!isPartialDetect) return null;
    const pointViews = [];
    barcodes.map((barcode, index) => {
      const cornerPoints = getPointsInView(barcode.cornerPoints);
      const isValid = validateBarcode(barcode);
      cornerPoints.forEach(point => {
        pointViews.push(
          <View
            key={'point' + pointViews.length}
            style={{
              borderRadius: 4,
              backgroundColor: isValid ? 'red' : 'gray',
              width: 8,
              height: 8,
              left: point.x,
              top: point.y,
              position: 'absolute',
            }}></View>,
        );
      });
    });
    return pointViews;
  };
  const onButtonAction = data => {
    if (props.onButtonAction) {
      props.onButtonAction(data);
    }
  };
  const renderSwitchPartialButton = () => {
    return (
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => {
          setIsPartialDetect(!isPartialDetect);
        }}>
        
      </TouchableOpacity>
    );
  };
  const renderCloseButton = () => {
    if (props.showClose) {
      return (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            if (props.onClose) {
              props.onClose();
            }
          }}>
          
        </TouchableOpacity>
      );
    }
    return null;
  };
  const renderCustomerMarker = () => {
    if (isPartialDetect) {
      return renderPartialCustomerMarker();
    }
    return (
      <View style={styles.cameraMarker}>
        <View style={{alignSelf: 'stretch', flexDirection: 'row'}}>
          <View
            style={{
              borderColor: Colors.green2Color,
              borderTopWidth: 4,
              borderLeftWidth: 4,
              width: 80,
              height: 80,
            }}
          />
          <View
            style={{
              width: 80,
              height: 70,
            }}
          />
          <View
            style={{
              borderColor: Colors.green2Color,
              borderTopWidth: 4,
              borderRightWidth: 4,
              width: 80,
              height: 80,
            }}
          />
        </View>
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            height: 70,
          }}
        />
        <View style={{alignSelf: 'stretch', flexDirection: 'row'}}>
          <View
            style={{
              borderColor: Colors.green2Color,
              borderBottomWidth: 4,
              borderLeftWidth: 4,
              width: 80,
              height: 80,
            }}
          />
          <View
            style={{
              width: 80,
              height: 70,
            }}
          />
          <View
            style={{
              borderColor: Colors.green2Color,
              borderBottomWidth: 4,
              borderRightWidth: 4,
              width: 80,
              height: 80,
            }}
          />
        </View>
      </View>
    );
  };
  const renderPartialCustomerMarker = () => {
    const centerSpacing = Values.deviceWidth - 160;
    return (
      <View style={styles.regionCameraMarker}>
        <View style={{alignSelf: 'stretch', flexDirection: 'row'}}>
          <View
            style={{
              borderColor: Colors.green2Color,
              borderTopWidth: 4,
              borderLeftWidth: 4,
              width: 40,
              height: 40,
            }}
          />
          <View
            style={{
              width: centerSpacing,
              height: 40,
            }}
          />
          <View
            style={{
              borderColor: Colors.green2Color,
              borderTopWidth: 4,
              borderRightWidth: 4,
              width: 40,
              height: 40,
            }}
          />
        </View>
        <View
          style={{
            alignSelf: 'stretch',
            flexDirection: 'row',
            height: 35,
          }}
        />
        <View style={{alignSelf: 'stretch', flexDirection: 'row'}}>
          <View
            style={{
              borderColor: Colors.green2Color,
              borderBottomWidth: 4,
              borderLeftWidth: 4,
              width: 40,
              height: 40,
            }}
          />
          <View
            style={{
              width: centerSpacing,
              height: 40,
            }}
          />
          <View
            style={{
              borderColor: Colors.green2Color,
              borderBottomWidth: 4,
              borderRightWidth: 4,
              width: 40,
              height: 40,
            }}
          />
        </View>
      </View>
    );
  };
  const renderLastScanResultView = () => {
    if (props.renderLastScanResultView) {
      return (
        <View
          style={{
            alignSelf: 'stretch',
            backgroundColor: Colors.bgColor,
            justifyContent: 'center',
          }}>
          {props.renderLastScanResultView()}
        </View>
      );
    }
    return null;
  };
  return (
    <View style={[styles.container, props.style]}>
      <View
        style={
          isPartialDetect
            ? {
                width: Values.deviceWidth,
                height: (Values.deviceWidth * 1920) / 1080,
                position: 'absolute',
                top: 0,
                left: 0,
              }
            : {
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                width: Values.deviceWidth,
                height: Values.deviceHeight,
              }
        }>
        {device != null && hasPermission && (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
        )}
        {renderCustomerMarker()}
        <View style={styles.detectLayer}>{renderBoundingBoxes()}</View>
      </View>
      {renderLastScanResultView()}

      {/*renderSwitchPartialButton()*/}
      {renderCloseButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'flex-end',
  },
  regionCameraMarker: {
    width: Values.deviceWidth - 80,
    height: 120,
    position: 'absolute',
    top: (Values.deviceHeight * 0.6 - 120) / 2,
    left: 40,
  },
  cameraMarker: {
    width: 230,
    height: 230,
  },

  closeButton: {
    position: 'absolute',
    top: 40,
    right: 24,
  },
  switchButton: {
    position: 'absolute',
    top: 35,
    left: 24,
  },
  detectLayer: {
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
  },
});

export default ScanView;
