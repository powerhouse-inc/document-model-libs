type StoryPoints = {
    total: number;
    completed: number;
};

type Percentage = {
    value: number;
};

type DeliverableProgress = StoryPoints | Percentage;

export function isDeliverableProgress(
    obj: DeliverableProgress,
): obj is DeliverableProgress {
    const isStoryPoints = (obj: StoryPoints): obj is StoryPoints =>
        typeof obj.total === 'number' &&
        obj.total > 0 &&
        typeof obj.completed === 'number' &&
        obj.completed >= 0 &&
        obj.completed <= obj.total;

    const isPercentage = (
        obj: Percentage | null | undefined,
    ): obj is Percentage =>
        typeof obj?.value === 'number' && obj.value >= 0 && obj.value <= 1;

    return isStoryPoints(obj as StoryPoints) || isPercentage(obj as Percentage);
}
