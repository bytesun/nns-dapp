/**
 * @jest-environment jsdom
 */

import { LedgerCanister } from "@dfinity/nns";
import { fireEvent } from "@testing-library/dom";
import { waitFor } from "@testing-library/svelte";
import { NNSDappCanister } from "../../../../lib/canisters/nns-dapp/nns-dapp.canister";
import IncreaseNeuronStakeModal from "../../../../lib/modals/neurons/IncreaseNeuronStakeModal.svelte";
import { accountsStore } from "../../../../lib/stores/accounts.store";
import {
  mockAccountsStoreSubscribe,
  mockSubAccount,
} from "../../../mocks/accounts.store.mock";
import en from "../../../mocks/i18n.mock";
import { MockLedgerCanister } from "../../../mocks/ledger.canister.mock";
import { renderModal } from "../../../mocks/modal.mock";
import { mockNeuron } from "../../../mocks/neurons.mock";
import { MockNNSDappCanister } from "../../../mocks/nns-dapp.canister.mock";

jest.mock("../../../../lib/services/neurons.services", () => {
  return {
    loadNeuron: jest.fn().mockResolvedValue(undefined),
  };
});

describe("IncreaseNeuronStakeModal", () => {
  const mockLedgerCanister: MockLedgerCanister = new MockLedgerCanister();
  const mockNNSDappCanister: MockNNSDappCanister = new MockNNSDappCanister();

  beforeAll(() => {
    jest
      .spyOn(accountsStore, "subscribe")
      .mockImplementation(mockAccountsStoreSubscribe([mockSubAccount]));

    jest
      .spyOn(LedgerCanister, "create")
      .mockImplementation((): LedgerCanister => mockLedgerCanister);

    jest
      .spyOn(NNSDappCanister, "create")
      .mockImplementation((): NNSDappCanister => mockNNSDappCanister);
  });

  afterAll(() => jest.clearAllMocks());

  it("should display modal", async () => {
    const { container } = await renderModal({
      component: IncreaseNeuronStakeModal,
      props: {
        neuron: mockNeuron,
      },
    });

    expect(container.querySelector("div.modal")).not.toBeNull();
  });

  const goToStep2 = async ({ container, getByText }) => {
    const mainAccount = container.querySelector(
      'article[role="button"]:first-of-type'
    ) as HTMLButtonElement;
    fireEvent.click(mainAccount);

    await waitFor(() =>
      expect(
        getByText(en.accounts.enter_icp_amount, { exact: false })
      ).toBeInTheDocument()
    );
  };

  const goToStep3 = async ({
    container,
    getByText,
    enterAmount,
  }: {
    container: HTMLElement;
    getByText;
    enterAmount: boolean;
  }) => {
    if (enterAmount) {
      const input: HTMLInputElement = container.querySelector(
        "input"
      ) as HTMLInputElement;
      await fireEvent.input(input, { target: { value: "1" } });
    }

    const button: HTMLButtonElement | null = container.querySelector(
      'button[type="submit"]'
    );

    await waitFor(() => expect(button?.getAttribute("disabled")).toBeNull());

    fireEvent.click(button as HTMLButtonElement);

    await waitFor(() =>
      expect(
        getByText(en.accounts.review_transaction, { exact: false })
      ).toBeInTheDocument()
    );
  };

  const goBack = async ({ container, getByText, title }) => {
    const back = container.querySelector("button.back") as HTMLButtonElement;
    fireEvent.click(back);

    await waitFor(() =>
      expect(getByText(title, { exact: false })).toBeInTheDocument()
    );
  };

  it("should navigate back and forth between steps", async () => {
    const { container, getByText } = await renderModal({
      component: IncreaseNeuronStakeModal,
      props: {
        neuron: mockNeuron,
      },
    });

    // Is step 1 active?
    expect(
      getByText(en.accounts.select_source, { exact: false })
    ).toBeInTheDocument();

    // Go to step 2.
    await goToStep2({ container, getByText });

    // Go back to step 1.
    await goBack({ container, getByText, title: en.accounts.select_source });

    // Go to step 2.
    await goToStep2({ container, getByText });

    // Go to step 3.
    await goToStep3({ container, getByText, enterAmount: true });

    // Go back to step 2.
    await goBack({
      container,
      getByText,
      title: en.accounts.enter_icp_amount,
    });
  });

  it("should close wizard once transaction executed", async () => {
    const { container, getByText, component } = await renderModal({
      component: IncreaseNeuronStakeModal,
      props: {
        neuron: mockNeuron,
      },
    });

    await goToStep2({ container, getByText });

    await goToStep3({ container, getByText, enterAmount: true });

    const button = container.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement;
    await fireEvent.click(button);

    const onClose = jest.fn();
    component.$on("nnsClose", onClose);
    await waitFor(() => expect(onClose).toBeCalled());
  });
});