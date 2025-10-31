import { fireEvent, render, screen } from "@testing-library/react-native";
import BlueToothConnectionPage1 from "../app/(tabs)/bluetoothPage1";

describe("BlueToothConnectionPage1Tests", () => {
  it("renders title, button, and ", () => {
    const { getByText } = render(<BlueToothConnectionPage1 />);
    expect(getByText(/To begin, ensure your device is turned on and within range./i)).toBeTruthy();
    expect(getByText("Pair Helmet")).toBeTruthy();
    expect(getByText(/Helmet Paired: Not connected/i)).toBeTruthy();
  });

  it("Start button prints to the console correctly", async () => {
    const logOutput = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getByText } = render(<BlueToothConnectionPage1 />);
    const startButton = getByText("Pair Helmet");
    fireEvent.press(startButton);
    const displayText = screen.findByText(/Helmet Paired: Connected/i);
  });
});