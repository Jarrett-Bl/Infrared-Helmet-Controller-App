import "@testing-library/jest-native/extend-expect";

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  // safeAreaProvider mock not needed yet, we should look into using it to make the spacing nicer, doesnt hurt anything  
  return {
    SafeAreaProvider: ({ children }) => <View>{children}</View>,
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));
