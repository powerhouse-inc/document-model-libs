import {
    Progress,
    StoryPoints,
    Percentage,
    DeliverablesCompleted,
    DeliverableStatus,
    MilestoneProgress,
    ProjectStatus,
} from '../gen/schema/types';

export function isProgress(obj: Progress | null | undefined): obj is Progress {
    return !!(
        obj &&
        'completed' in obj &&
        'total' in obj &&
        (isStoryPoints(obj) ||
            isPercentage(obj) ||
            isDeliverablesCompleted(obj))
    );
}

export function isStoryPoints(obj: StoryPoints): obj is StoryPoints {
    return typeof obj.completed === 'number' && typeof obj.total === 'number';
}

export function isPercentage(obj: Percentage): obj is Percentage {
    return typeof obj.value === 'number';
}

export function isDeliverablesCompleted(
    obj: DeliverablesCompleted,
): obj is DeliverablesCompleted {
    return typeof obj.total === 'number' && typeof obj.completed === 'number';
}

export function isDeliverableStatus(obj: string): obj is DeliverableStatus {
    return ['BLOCKED', 'DELIVERED', 'IN_PROGRESS', 'TODO', 'WONT_DO'].includes(
        obj,
    );
}

export function checkMilestoneProgress(milestoneProgress: MilestoneProgress) {
    const validStatuses = ['TODO', 'IN_PROGRESS', 'FINISHED'];
    if (!validStatuses.includes(milestoneProgress.status)) {
        throw new Error(
            `InvalidStatusValue: Provided status value is not a valid MilestoneStatus`,
        );
    }
    if (!isProgress(milestoneProgress.indication)) {
        throw new Error(`InvalidProgressValue: Progress indication is invalid`);
    }
    return true;
}

export function generateId<T extends { id?: string } | null>(
    items: T[],
): string {
    let maxId = 0;
    for (const item of items) {
        if (item?.id !== undefined && parseFloat(item.id) > maxId) {
            maxId = parseFloat(item.id);
        }
    }
    return String(maxId + 1);
}

// create isProjectStatus function
export function isProjectStatus(obj: string): obj is ProjectStatus {
    return ['TODO', 'IN_PROGRESS', 'FINISHED'].includes(obj);
}
