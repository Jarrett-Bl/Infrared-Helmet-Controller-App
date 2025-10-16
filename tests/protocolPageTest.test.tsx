import { fireEvent, render } from "@testing-library/react-native";
import ProtocolsPage from "../app/(tabs)/protocolPage";

describe("ProtocolsPageTests", () => {
  it("renders the UI for the title and search bar", () => {
    const { getByText, getByPlaceholderText } = render(<ProtocolsPage />);
    expect(getByText("Protocols")).toBeTruthy();
    expect(getByPlaceholderText(/search by name or id/i)).toBeTruthy();
  });

  it("updates the search input when the user types", () => {
    const { getByPlaceholderText } = render(<ProtocolsPage />);
    const searchInput = getByPlaceholderText(/search by name or id/i);

    fireEvent.changeText(searchInput, "focus");
    expect(searchInput.props.value).toBe("focus");
  });

  it("pressing Load on a card prints to the console", () => {
    const logOutput = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getAllByText } = render(<ProtocolsPage />);
    const loadButton = getAllByText("Load")[0];

    fireEvent.press(loadButton);
    expect(logOutput).toHaveBeenCalledWith(
      "Load protocol:",
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        powerLevel: expect.any(Number),
        frequencyHz: expect.any(Number),
        sessionDurationMin: expect.any(Number),
        activeZones: expect.any(Array),
      })
    );

    logOutput.mockRestore();
  });
});