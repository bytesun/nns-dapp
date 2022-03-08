import { NeuronState } from "@dfinity/nns";
import type { SvelteComponent } from "svelte";
import IconHistoryToggleOff from "../icons/IconHistoryToggleOff.svelte";
import IconLockClock from "../icons/IconLockClock.svelte";
import IconLockOpen from "../icons/IconLockOpen.svelte";

export type StateInfo = {
  textKey: string;
  Icon?: typeof SvelteComponent;
  colorVar: "--gray-50" | "--yellow-500" | "--gray-200";
};

type StateMapper = {
  [key: number]: StateInfo;
};
const stateTextMapper: StateMapper = {
  [NeuronState.LOCKED]: {
    textKey: "locked",
    Icon: IconLockClock,
    colorVar: "--gray-50",
  },
  [NeuronState.UNSPECIFIED]: {
    textKey: "unspecified",
    colorVar: "--gray-50",
  },
  [NeuronState.DISSOLVED]: {
    textKey: "dissolved",
    Icon: IconLockOpen,
    colorVar: "--gray-200",
  },
  [NeuronState.DISSOLVING]: {
    textKey: "dissolving",
    Icon: IconHistoryToggleOff,
    colorVar: "--yellow-500",
  },
};

export const getStateInfo = (neuronState: NeuronState): StateInfo =>
  stateTextMapper[neuronState];