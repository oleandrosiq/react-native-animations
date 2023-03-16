import { View, Pressable, Text, Button } from 'react-native';
import { styles } from './styles';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  Easing,
  withSequence,
  interpolateColor,
  withSpring
} from 'react-native-reanimated';

/**
 * useAnimatedStyles
 * useSharedValue
 * Animated.View
 */

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

export default function App() {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  const handleScaleAnimation = (value: number) => {
    scale.value = withTiming(value,{
      duration: 700,
      easing: Easing.elastic(2)      
    });
  }

  const handleTranslateXAnimation = () => {
    scale.value = withTiming(1.5, 
      { duration: 2000 }, 
      (finished) => {
      if (finished) {
        translateX.value = withSequence(
          withTiming(150),
          withTiming(-150),
          withSpring(0, undefined, (finished) => {
            if (finished) {
              scale.value = withSpring(1);
            }
          })
        )
      }
    });
  }

  const handlePressIn = () => handleScaleAnimation(1.5);
  
  const handlePressOut = () => handleScaleAnimation(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value }
    ],
    backgroundColor: interpolateColor(
      scale.value, 
      [1, 1.5], 
      ['blue', 'red']
    )
  }));

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.box, animatedStyle]} 
      />

      <Pressable
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text>Clique Aqui</Text>
      </Pressable>

      <Button 
        title='Animar' 
        onPress={handleTranslateXAnimation}
      />
    </View>
  );
}