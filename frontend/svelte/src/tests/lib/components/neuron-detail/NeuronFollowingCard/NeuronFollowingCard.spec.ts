/**
 * @jest-environment jsdom
 */

import { Topic, type NeuronInfo } from "@dfinity/nns";
import { render } from "@testing-library/svelte";
import NeuronFollowingCard from "../../../../../lib/components/neuron-detail/NeuronFollowingCard/NeuronFollowingCard.svelte";
import { authStore } from "../../../../../lib/stores/auth.store";
import {
  mockAuthStoreSubscribe,
  mockIdentity,
} from "../../../../mocks/auth.store.mock";
import en from "../../../../mocks/i18n.mock";
import { mockFullNeuron, mockNeuron } from "../../../../mocks/neurons.mock";

describe("NeuronFollowingCard", () => {
  const followees = [111, 222, 333].map(BigInt);
  const neuron: NeuronInfo = {
    ...mockNeuron,
    fullNeuron: {
      ...mockFullNeuron,
      controller: mockIdentity.getPrincipal().toText(),
      followees: [
        {
          topic: Topic.ExchangeRate,
          followees: followees,
        },
      ],
    },
  };
  beforeEach(() => {
    jest
      .spyOn(authStore, "subscribe")
      .mockImplementation(mockAuthStoreSubscribe);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it("should render texts", () => {
    const { getByText } = render(NeuronFollowingCard, {
      props: {
        neuron,
      },
    });

    expect(getByText(en.neuron_detail.following_title)).toBeInTheDocument();
    expect(
      getByText(en.neuron_detail.following_description)
    ).toBeInTheDocument();
  });

  it("should render edit button", () => {
    const { getByText } = render(NeuronFollowingCard, {
      props: {
        neuron,
      },
    });
    expect(getByText(en.neuron_detail.follow_neurons)).toBeInTheDocument();
  });

  it("should render followees", () => {
    const { getByText } = render(NeuronFollowingCard, {
      props: {
        neuron,
      },
    });
    followees.forEach((id) =>
      expect(getByText(id.toString())).toBeInTheDocument()
    );
  });

  it("should render no frame if no followees available", () => {
    const { container } = render(NeuronFollowingCard, {
      props: {
        neuron: mockNeuron,
      },
    });
    expect(container.querySelector(".frame")).toBeNull();
  });
});