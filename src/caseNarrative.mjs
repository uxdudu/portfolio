export const CASE_STAGE_ORDER = [
  "intro",
  "challenge",
  "before",
  "during",
  "after",
  "testimonial",
  "next",
];

export function orderCaseStages(items, getStage) {
  return items
    .map((item, index) => ({
      item,
      index,
      stageIndex: CASE_STAGE_ORDER.indexOf(getStage(item)),
    }))
    .sort((first, second) => {
      const firstStage = first.stageIndex === -1 ? 0 : first.stageIndex;
      const secondStage = second.stageIndex === -1 ? 0 : second.stageIndex;
      return firstStage - secondStage || first.index - second.index;
    })
    .map(({ item }) => item);
}
