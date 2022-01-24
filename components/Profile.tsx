import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {IProfile} from './Profile.types';

const SECOND = 1000;
const AVATAR_SIZE = 70;
const SPACING = 20;
const {width} = Dimensions.get('screen');

const UndoDelete = ({
  undo,
  isDeleted,
}: {
  undo: () => void;
  isDeleted: boolean;
}) => {
  //   const getUndoStyles = () => {
  //     if (isDeleted) {
  //       return {
  //         borderWidth: 1,
  //         borderColor: 'rgba(0, 0, 0, 0.5)',
  //       };
  //     }
  //     return {};
  //   };

  return (
    <TouchableOpacity style={styles.undoContainer} onPress={undo}>
      {isDeleted && (
        <Text style={{fontSize: 24, textAlign: 'center'}}> {'Undo'}</Text>
      )}
    </TouchableOpacity>
  );
};

export const Profile = ({
  profile,
  removeProfile,
}: {
  profile: IProfile;
  removeProfile: (key: string) => any;
}) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const pan = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const {name, image, email, key} = profile;

  const springBackToInitialPosition = () =>
    Animated.spring(pan, {
      toValue: {
        x: 0,
        y: 0,
      },
      useNativeDriver: true,
    }).start();

  const undoDelete = useCallback(() => {
    setIsDeleted(false);
    springBackToInitialPosition();
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
        if (gestureState.dx >= width / 3) {
          console.log('Deleted ', name);
          console.log('');
          setIsDeleted(true);
        }
      },
      onPanResponderRelease: () => springBackToInitialPosition(),
    }),
  ).current;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isDeleted) {
      timer = setTimeout(() => {
        if (isDeleted) {
          removeProfile(key);
        }
      }, 2 * SECOND);
    }
    return () => clearTimeout(timer);
  }, [isDeleted]);

  return (
    <>
      <UndoDelete undo={undoDelete} isDeleted={isDeleted} />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [
              {
                translateX: isDeleted ? width * 2 : pan.x,
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}>
        <Image source={{uri: image}} style={styles.img} />
        <View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
            }}>
            {name}
          </Text>

          <Text
            style={{
              fontSize: 14,
              opacity: 0.8,
              color: '#0099cc',
            }}>
            {email}
          </Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    padding: SPACING,
    marginBottom: SPACING,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    position: 'absolute',
  },
  undoContainer: {
    height: AVATAR_SIZE + 2 * SPACING,
    padding: SPACING,
    marginBottom: SPACING,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  img: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE,
    marginRight: SPACING / 2,
  },
});
