/**
 * @jest-environment jsdom
 */

import CyclesCard from "$lib/components/canister-detail/CyclesCard.svelte";
import { formatCyclesToTCycles } from "$lib/utils/canisters.utils";
import { render } from "@testing-library/svelte";
import en from "../../../mocks/i18n.mock";

describe("CyclesCard", () => {
  it("renders title as aria label", () => {
    const { container } = render(CyclesCard, {
      props: { cycles: BigInt(10) },
    });

    expect(
      (container.querySelector("p") as HTMLParagraphElement).getAttribute(
        "aria-label"
      )
    ).toEqual(en.canister_detail.cycles);
  });

  it("renders cycles", () => {
    const cycles = BigInt(2_000_000_000_000);
    const { queryByText } = render(CyclesCard, {
      props: { cycles },
    });

    expect(queryByText(formatCyclesToTCycles(cycles))).toBeInTheDocument();
  });
});
