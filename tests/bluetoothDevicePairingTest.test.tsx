import { fireEvent, render } from "@testing-library/react-native";
import BlueToothConnectionPage2 from "../app/bluetoothDevicePairing";

describe("BlueToothConnectionPage2Tests", () => {
  it("renders the UI for the title and start button", () => {
    const { getByText } = render(<BlueToothConnectionPage2 />);
    expect(getByText(/Press start to begin designing protocol/i)).toBeTruthy();
    expect(getByText("Start")).toBeTruthy();
  });

  it("Start button prints to the console correctly", () => {
    const logOutput = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getByText } = render(<BlueToothConnectionPage2 />);
    const startButton = getByText("Start");
    fireEvent.press(startButton);
    expect(logOutput).toHaveBeenCalledWith("Connect pressed");
    logOutput.mockRestore();
  });
});
